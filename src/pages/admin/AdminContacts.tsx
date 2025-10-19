import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, MessageCircle, Save } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";

const AdminContacts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Contact Information
  const [whatsappNumber, setWhatsappNumber] = useState("+91 1234567890");
  const [primaryEmail, setPrimaryEmail] = useState("ravi.rv73838@icloud.com");
  const [supportEmail, setSupportEmail] = useState("support@ravisharmaphotofilms.in");
  const [phoneNumber, setPhoneNumber] = useState("+91 1234567890");

  // Google Review Widget
  const [googleReviewEnabled, setGoogleReviewEnabled] = useState(true);
  const [googlePlaceId, setGooglePlaceId] = useState("");
  const [googleBusinessName, setGoogleBusinessName] = useState("Ravi Sharma Photo & Films");

  const handleSave = async () => {
    setLoading(true);
    try {
      await db.adminSettings.set('contacts', {
        whatsappNumber,
        primaryEmail,
        supportEmail,
        phoneNumber,
        googleReview: {
          enabled: googleReviewEnabled,
          placeId: googlePlaceId,
          businessName: googleBusinessName
        }
      });

      toast({
        title: "Contacts Saved",
        description: "Contact information has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save contacts",
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
            <h1 className="text-2xl font-serif gold-text">Contact Management</h1>
          </div>
          <GoldButton onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </GoldButton>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Basic Contact Information */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-600" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 1234567890"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +91 for India)</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Primary Email
              </label>
              <input
                type="email"
                value={primaryEmail}
                onChange={(e) => setPrimaryEmail(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 1234567890"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Google Review Widget */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text">Google Review Widget</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Enable Google Review Request</label>
                <p className="text-xs text-muted-foreground">Show Google review prompt for 5-star feedback</p>
              </div>
              <input
                type="checkbox"
                checked={googleReviewEnabled}
                onChange={(e) => setGoogleReviewEnabled(e.target.checked)}
                className="w-5 h-5 rounded"
              />
            </div>

            {googleReviewEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Google Place ID</label>
                  <input
                    type="text"
                    value={googlePlaceId}
                    onChange={(e) => setGooglePlaceId(e.target.value)}
                    placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Find your Place ID at{" "}
                    <a
                      href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Place ID Finder
                    </a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Name</label>
                  <input
                    type="text"
                    value={googleBusinessName}
                    onChange={(e) => setGoogleBusinessName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-serif mb-4 gold-text">Contact Preview</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span>WhatsApp: {whatsappNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>Email: {primaryEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>Phone: {phoneNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;
