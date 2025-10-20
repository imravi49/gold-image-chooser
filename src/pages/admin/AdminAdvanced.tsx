import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Database, Mail, Cloud, Zap } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AdminAdvanced = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Google Review Widget
  const [googlePlaceId, setGooglePlaceId] = useState("");
  const [googleWidgetEnabled, setGoogleWidgetEnabled] = useState(false);

  // EmailJS for finalization notifications
  const [emailjsServiceId, setEmailjsServiceId] = useState("");
  const [emailjsTemplateId, setEmailjsTemplateId] = useState("");
  const [emailjsPublicKey, setEmailjsPublicKey] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("ravi.rv73838@gmail.com");

  // Google Drive API
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleClientSecret, setGoogleClientSecret] = useState("");
  const [driveRootFolder, setDriveRootFolder] = useState("");

  // Firebase Configuration (for future migration)
  const [firebaseApiKey, setFirebaseApiKey] = useState("");
  const [firebaseAuthDomain, setFirebaseAuthDomain] = useState("rsfilms-732e0.firebaseapp.com");
  const [firebaseProjectId, setFirebaseProjectId] = useState("rsfilms-732e0");
  const [firebaseStorageBucket, setFirebaseStorageBucket] = useState("rsfilms-732e0.firebasestorage.app");
  const [firebaseMessagingSenderId, setFirebaseMessagingSenderId] = useState("360154116623");
  const [firebaseAppId, setFirebaseAppId] = useState("");
  const [firebaseServiceAccount, setFirebaseServiceAccount] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [googleWidget, emailjs, googleDrive, firebase] = await Promise.all([
        db.adminSettings.get('google_widget'),
        db.adminSettings.get('emailjs_advanced'),
        db.adminSettings.get('google_drive_api'),
        db.adminSettings.get('firebase_config')
      ]);

      if (googleWidget) {
        const value = googleWidget.value as any;
        setGooglePlaceId(value.placeId || "");
        setGoogleWidgetEnabled(value.enabled || false);
      }

      if (emailjs) {
        const value = emailjs.value as any;
        setEmailjsServiceId(value.serviceId || "");
        setEmailjsTemplateId(value.templateId || "");
        setEmailjsPublicKey(value.publicKey || "");
        setNotificationEmail(value.notificationEmail || "ravi.rv73838@gmail.com");
      }

      if (googleDrive) {
        const value = googleDrive.value as any;
        setGoogleApiKey(value.apiKey || "");
        setGoogleClientId(value.clientId || "");
        setGoogleClientSecret(value.clientSecret || "");
        setDriveRootFolder(value.rootFolder || "");
      }

      if (firebase) {
        const value = firebase.value as any;
        setFirebaseApiKey(value.apiKey || "");
        setFirebaseAuthDomain(value.authDomain || "rsfilms-732e0.firebaseapp.com");
        setFirebaseProjectId(value.projectId || "rsfilms-732e0");
        setFirebaseStorageBucket(value.storageBucket || "rsfilms-732e0.firebasestorage.app");
        setFirebaseMessagingSenderId(value.messagingSenderId || "360154116623");
        setFirebaseAppId(value.appId || "");
        setFirebaseServiceAccount(value.serviceAccount || "");
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await Promise.all([
        db.adminSettings.set('google_widget', {
          placeId: googlePlaceId,
          enabled: googleWidgetEnabled
        }),
        db.adminSettings.set('emailjs_advanced', {
          serviceId: emailjsServiceId,
          templateId: emailjsTemplateId,
          publicKey: emailjsPublicKey,
          notificationEmail
        }),
        db.adminSettings.set('google_drive_api', {
          apiKey: googleApiKey,
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          rootFolder: driveRootFolder
        }),
        db.adminSettings.set('firebase_config', {
          apiKey: firebaseApiKey,
          authDomain: firebaseAuthDomain,
          projectId: firebaseProjectId,
          storageBucket: firebaseStorageBucket,
          messagingSenderId: firebaseMessagingSenderId,
          appId: firebaseAppId,
          serviceAccount: firebaseServiceAccount,
          // Firebase collections schema for migration
          collections: {
            users: {
              fields: ['username', 'name', 'email', 'contact', 'folderPath', 'selectionLimit', 'isFinalized', 'createdAt', 'lastLogin']
            },
            photos: {
              fields: ['fileName', 'folderPath', 'fullUrl', 'thumbnailUrl', 'fileSize', 'width', 'height', 'createdAt']
            },
            selections: {
              fields: ['userId', 'photoId', 'category', 'status', 'selectedAt']
            },
            feedback: {
              fields: ['userId', 'overallRating', 'selectionExperience', 'photoQuality', 'comments', 'isPublishable', 'createdAt']
            },
            activityLogs: {
              fields: ['userId', 'action', 'details', 'ipAddress', 'createdAt']
            },
            settings: {
              fields: ['key', 'value', 'updatedAt']
            }
          }
        })
      ]);

      toast({
        title: "Advanced Settings Saved",
        description: "All integrations have been configured successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save advanced settings",
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
            <h1 className="text-2xl font-serif gold-text">Advanced Settings</h1>
          </div>
          <GoldButton onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save All
          </GoldButton>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Google Review Widget */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Google Review Widget
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="googlePlaceId">Google Place ID</Label>
              <Input
                id="googlePlaceId"
                value={googlePlaceId}
                onChange={(e) => setGooglePlaceId(e.target.value)}
                placeholder="Enter your Google Business Place ID"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Find your Place ID at <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" className="text-primary hover:underline">Google Places API</a>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Google Review Widget</Label>
                <p className="text-xs text-muted-foreground">Show after 5-star feedback</p>
              </div>
              <input
                type="checkbox"
                checked={googleWidgetEnabled}
                onChange={(e) => setGoogleWidgetEnabled(e.target.checked)}
                className="w-5 h-5 rounded"
              />
            </div>
          </div>
        </div>

        {/* EmailJS Configuration */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text flex items-center gap-2">
            <Mail className="w-5 h-5" />
            EmailJS - Finalization Notifications
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="emailjsServiceId">Service ID</Label>
              <Input
                id="emailjsServiceId"
                value={emailjsServiceId}
                onChange={(e) => setEmailjsServiceId(e.target.value)}
                placeholder="service_xxxxx"
              />
            </div>

            <div>
              <Label htmlFor="emailjsTemplateId">Template ID</Label>
              <Input
                id="emailjsTemplateId"
                value={emailjsTemplateId}
                onChange={(e) => setEmailjsTemplateId(e.target.value)}
                placeholder="template_xxxxx"
              />
            </div>

            <div>
              <Label htmlFor="emailjsPublicKey">Public Key</Label>
              <Input
                id="emailjsPublicKey"
                value={emailjsPublicKey}
                onChange={(e) => setEmailjsPublicKey(e.target.value)}
                placeholder="Your EmailJS public key"
              />
            </div>

            <div>
              <Label htmlFor="notificationEmail">Notification Email</Label>
              <Input
                id="notificationEmail"
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Google Drive API */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Google Drive Storage
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="googleApiKey">Google API Key</Label>
              <Input
                id="googleApiKey"
                type="password"
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                placeholder="Your Google API key"
              />
            </div>

            <div>
              <Label htmlFor="googleClientId">OAuth Client ID</Label>
              <Input
                id="googleClientId"
                value={googleClientId}
                onChange={(e) => setGoogleClientId(e.target.value)}
                placeholder="xxxxx.apps.googleusercontent.com"
              />
            </div>

            <div>
              <Label htmlFor="googleClientSecret">OAuth Client Secret</Label>
              <Input
                id="googleClientSecret"
                type="password"
                value={googleClientSecret}
                onChange={(e) => setGoogleClientSecret(e.target.value)}
                placeholder="Your OAuth client secret"
              />
            </div>

            <div>
              <Label htmlFor="driveRootFolder">Root Folder ID</Label>
              <Input
                id="driveRootFolder"
                value={driveRootFolder}
                onChange={(e) => setDriveRootFolder(e.target.value)}
                placeholder="Google Drive folder ID"
              />
            </div>
          </div>
        </div>

        {/* Firebase Configuration */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text flex items-center gap-2">
            <Database className="w-5 h-5" />
            Firebase Configuration (Future Migration)
          </h2>
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">
                Configure Firebase settings for seamless future migration. Collections and fields are pre-configured.
              </p>
            </div>

            <div>
              <Label htmlFor="firebaseApiKey">API Key</Label>
              <Input
                id="firebaseApiKey"
                type="password"
                value={firebaseApiKey}
                onChange={(e) => setFirebaseApiKey(e.target.value)}
                placeholder="Your Firebase API key"
              />
            </div>

            <div>
              <Label htmlFor="firebaseAuthDomain">Auth Domain</Label>
              <Input
                id="firebaseAuthDomain"
                value={firebaseAuthDomain}
                onChange={(e) => setFirebaseAuthDomain(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="firebaseProjectId">Project ID</Label>
              <Input
                id="firebaseProjectId"
                value={firebaseProjectId}
                onChange={(e) => setFirebaseProjectId(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="firebaseStorageBucket">Storage Bucket</Label>
              <Input
                id="firebaseStorageBucket"
                value={firebaseStorageBucket}
                onChange={(e) => setFirebaseStorageBucket(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="firebaseMessagingSenderId">Messaging Sender ID</Label>
              <Input
                id="firebaseMessagingSenderId"
                value={firebaseMessagingSenderId}
                onChange={(e) => setFirebaseMessagingSenderId(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="firebaseAppId">App ID</Label>
              <Input
                id="firebaseAppId"
                value={firebaseAppId}
                onChange={(e) => setFirebaseAppId(e.target.value)}
                placeholder="Your Firebase App ID"
              />
            </div>

            <div>
              <Label htmlFor="firebaseServiceAccount">Service Account JSON</Label>
              <Textarea
                id="firebaseServiceAccount"
                value={firebaseServiceAccount}
                onChange={(e) => setFirebaseServiceAccount(e.target.value)}
                placeholder='{"type": "service_account", ...}'
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste your Firebase service account JSON here
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Pre-configured Collections:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ users (authentication & profiles)</li>
                <li>✓ photos (gallery images)</li>
                <li>✓ selections (user selections)</li>
                <li>✓ feedback (client reviews)</li>
                <li>✓ activityLogs (system logs)</li>
                <li>✓ settings (configuration)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAdvanced;
