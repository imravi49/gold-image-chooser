import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Palette, 
  Settings, 
  MessageSquare, 
  Activity,
  Phone,
  LogOut,
  Download,
  Mail
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GoldButton } from "@/components/GoldButton";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSelections: 0,
    totalFeedbacks: 0,
    finalized: 0
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }

      // Check if user has admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await fetchStats();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [usersRes, selectionsRes, feedbacksRes] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('selections').select('*', { count: 'exact', head: true }),
        supabase.from('feedback').select('*', { count: 'exact', head: true })
      ]);

      const { data: finalizedUsers } = await supabase
        .from('users')
        .select('id')
        .eq('is_finalized', true);

      setStats({
        totalUsers: usersRes.count || 0,
        totalSelections: selectionsRes.count || 0,
        totalFeedbacks: feedbacksRes.count || 0,
        finalized: finalizedUsers?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen cinematic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const menuItems = [
    { icon: Users, label: "Users", description: "Manage client accounts", path: "/admin/users" },
    { icon: Palette, label: "Design", description: "Customize branding", path: "/admin/design" },
    { icon: Settings, label: "Settings", description: "Site configuration", path: "/admin/settings" },
    { icon: MessageSquare, label: "Feedback", description: "View client feedback", path: "/admin/feedback" },
    { icon: Activity, label: "Activity Logs", description: "Monitor user activity", path: "/admin/logs" },
    { icon: Phone, label: "Contacts", description: "Manage contact info", path: "/admin/contacts" }
  ];

  return (
    <div className="min-h-screen cinematic-gradient">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-soft sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif gold-text">Admin Dashboard</h1>
          <GoldButton variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </GoldButton>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold gold-text">{stats.totalUsers}</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Selections</h3>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold gold-text">{stats.totalSelections}</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Feedback Received</h3>
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold gold-text">{stats.totalFeedbacks}</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Finalized</h3>
              <Download className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold gold-text">{stats.finalized}</p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-gold transition-smooth text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 gold-text">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-4 gold-text">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <GoldButton variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Selection CSV
            </GoldButton>
            <GoldButton variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Send Helper Scripts
            </GoldButton>
            <GoldButton variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Generate ZIP
            </GoldButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
