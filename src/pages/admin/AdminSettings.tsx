import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Save, Link as LinkIcon } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // General Settings
  const [globalSelectionLimit, setGlobalSelectionLimit] = useState(150);
  const [autoFinalizeEnabled, setAutoFinalizeEnabled] = useState(false);
  const [requireFeedback, setRequireFeedback] = useState(true);

  // Google Drive Settings
  const [driveRootFolderId, setDriveRootFolderId] = useState("");
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // EmailJS Settings
  const [emailjsServiceId, setEmailjsServiceId] = useState("service_zl7rcg1");
  const [emailjsTemplateId, setEmailjsTemplateId] = useState("template_n5ur429");
  const [emailjsPublicKey, setEmailjsPublicKey] = useState("a4-PdJdb-Lp5Vt8_3");
  const [adminEmail, setAdminEmail] = useState("ravi.rv73838@icloud.com");

  const handleSave = async () => {
    setLoading(true);
    try {
      await db.adminSettings.set('general_settings', {
        globalSelectionLimit,
        autoFinalizeEnabled,
        requireFeedback
      });

      await db.adminSettings.set('drive_settings', {
        driveRootFolderId,
        autoSyncEnabled
      });

      await db.adminSettings.set('emailjs_settings', {
        emailjsServiceId,
        emailjsTemplateId,
        emailjsPublicKey,
        adminEmail
      });

      toast({
        title: "Settings Saved",
        description: "All settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen cinematic-gradient">
      <header className="bg-card/80 backdrop-blur-sm shadow-soft sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <GoldButton variant="outline" onClick={() => navigate('/admin')}>
              ← Back
            </GoldButton>
            <h1 className="text-2xl font-serif gold-text">Settings</h1>
          </div>
          <GoldButton onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </GoldButton>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* General Settings */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text flex items-center gap-2">
            <Settings className="w-5 h-5" />
            General Settings
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Global Selection Limit</label>
              <input
                type="number"
                value={globalSelectionLimit}
                onChange={(e) => setGlobalSelectionLimit(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">Default number of photos each user can select</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Auto-Finalize After Limit</label>
                <p className="text-xs text-muted-foreground">Automatically finalize when user reaches selection limit</p>
              </div>
              <input
                type="checkbox"
                checked={autoFinalizeEnabled}
                onChange={(e) => setAutoFinalizeEnabled(e.target.checked)}
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Require Feedback Before Finalize</label>
                <p className="text-xs text-muted-foreground">Users must provide feedback to complete selection</p>
              </div>
              <input
                type="checkbox"
                checked={requireFeedback}
                onChange={(e) => setRequireFeedback(e.target.checked)}
                className="w-5 h-5 rounded"
              />
            </div>
          </div>
        </div>

        {/* Google Drive Settings */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Google Drive Integration
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Root Folder ID</label>
              <input
                type="text"
                value={driveRootFolderId}
                onChange={(e) => setDriveRootFolderId(e.target.value)}
                placeholder="Enter Google Drive folder ID"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">The main folder containing all client photo folders</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Auto-Sync on User Login</label>
                <p className="text-xs text-muted-foreground">Automatically scan and sync photos from Drive</p>
              </div>
              <input
                type="checkbox"
                checked={autoSyncEnabled}
                onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                className="w-5 h-5 rounded"
              />
            </div>
          </div>
        </div>

        {/* EmailJS Settings */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text">EmailJS Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service ID</label>
              <input
                type="text"
                value={emailjsServiceId}
                onChange={(e) => setEmailjsServiceId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Template ID</label>
              <input
                type="text"
                value={emailjsTemplateId}
                onChange={(e) => setEmailjsTemplateId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Public Key</label>
              <input
                type="text"
                value={emailjsPublicKey}
                onChange={(e) => setEmailjsPublicKey(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">Email address to receive finalization notifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
