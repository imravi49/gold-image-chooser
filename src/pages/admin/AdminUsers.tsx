import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Edit, Trash2, Download, RefreshCw } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { supabase } from "@/integrations/supabase/client";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await db.users.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (users.length === 0) {
      toast({
        title: "No Data",
        description: "No users available to export",
        variant: "destructive"
      });
      return;
    }

    const exportData = users.map(user => ({
      username: user.username,
      name: user.name,
      contact: user.contact || '-',
      folder_path: user.folder_path || '-',
      selection_limit: user.selection_limit,
      status: user.is_finalized ? 'Finalized' : 'Active',
      created_at: new Date(user.created_at).toLocaleDateString(),
      last_login: user.last_login ? new Date(user.last_login).toLocaleString() : '-'
    }));

    const { exportToCSV } = require('@/utils/csvExport');
    exportToCSV(exportData, 'users');
    
    toast({
      title: "Export Complete",
      description: "Users CSV has been downloaded",
    });
  };

  const handleResetUser = async (userId: string) => {
    try {
      await db.users.update(userId, { is_finalized: false });
      toast({
        title: "Success",
        description: "User has been reset and can select photos again",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive"
        });
        return;
      }

      const response = await supabase.functions.invoke('admin-user-management', {
        body: {
          action: 'delete',
          userId,
        },
      });

      if (response.error || response.data?.error) {
        throw new Error(response.data?.error || response.error.message);
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } catch (error: any) {
      console.error('User deletion error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen cinematic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cinematic-gradient">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-soft sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <GoldButton variant="outline" onClick={() => navigate('/admin')}>
              ← Back
            </GoldButton>
            <h1 className="text-2xl font-serif gold-text">User Management</h1>
          </div>
          <div className="flex gap-2">
            <GoldButton variant="outline" onClick={handleDownloadCSV}>
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </GoldButton>
            <GoldButton onClick={() => navigate('/admin/users/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </GoldButton>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Users Table */}
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Folder Path</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Limit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 text-sm">{user.username}</td>
                    <td className="px-6 py-4 text-sm">{user.name}</td>
                    <td className="px-6 py-4 text-sm">{user.contact || '-'}</td>
                    <td className="px-6 py-4 text-sm text-xs">{user.folder_path || '-'}</td>
                    <td className="px-6 py-4 text-sm">{user.selection_limit}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_finalized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.is_finalized ? 'Finalized' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleResetUser(user.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Reset finalization"
                        >
                          <RefreshCw className="w-4 h-4 text-primary" />
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
