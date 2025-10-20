import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Download, Filter } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";

const AdminLogs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'user' | 'admin'>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await db.logs.getAll();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to load activity logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filterType === 'all') return true;
    if (filterType === 'user') return log.action.toLowerCase().includes('select') || log.action.toLowerCase().includes('login');
    if (filterType === 'admin') return log.action.toLowerCase().includes('admin') || log.action.toLowerCase().includes('setting');
    return true;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast({
        title: "No Data",
        description: "No logs available to export",
        variant: "destructive"
      });
      return;
    }

    const exportData = filteredLogs.map(log => ({
      timestamp: new Date(log.created_at).toLocaleString(),
      action: log.action,
      user_id: log.user_id || 'System',
      ip_address: log.ip_address || '-',
      details: log.details ? JSON.stringify(log.details) : '-'
    }));

    const { exportToCSV } = require('@/utils/csvExport');
    exportToCSV(exportData, 'activity-logs');
    
    toast({
      title: "Export Complete",
      description: "Activity logs CSV has been downloaded",
    });
  };

  const getActionColor = (action: string) => {
    if (action.includes('login')) return 'text-blue-600';
    if (action.includes('select')) return 'text-green-600';
    if (action.includes('delete')) return 'text-red-600';
    if (action.includes('finalize')) return 'text-purple-600';
    return 'text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="min-h-screen cinematic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cinematic-gradient">
      <header className="bg-card/80 backdrop-blur-sm shadow-soft sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <GoldButton variant="outline" onClick={() => navigate('/admin')}>
              ← Back
            </GoldButton>
            <h1 className="text-2xl font-serif gold-text">Activity Logs</h1>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-transparent border-none text-sm focus:outline-none"
              >
                <option value="all">All Logs</option>
                <option value="user">User Activity</option>
                <option value="admin">Admin Activity</option>
              </select>
            </div>
            <GoldButton variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </GoldButton>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Timestamp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">IP Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{log.user_id || 'System'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {log.ip_address || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {log.details ? JSON.stringify(log.details).slice(0, 50) + '...' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activity logs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
