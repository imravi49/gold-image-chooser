import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Palette, Upload, Save } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";

const AdminDesign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  
  // Colors
  const [primaryColor, setPrimaryColor] = useState("#D4AF37");
  const [textColor, setTextColor] = useState("#1A1F2C");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [secondaryColor, setSecondaryColor] = useState("#F8F9FA");
  
  // Fonts
  const [headingFont, setHeadingFont] = useState("Playfair Display");
  const [bodyFont, setBodyFont] = useState("Inter");

  // Hero Section
  const [heroTitle, setHeroTitle] = useState("Welcome to Your Gallery");
  const [heroSubtitle, setHeroSubtitle] = useState("Select your favorite moments");
  const [aboutTitle, setAboutTitle] = useState("About Your Selection");
  const [aboutDescription, setAboutDescription] = useState("Choose the photos that capture your special moments.");

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setLogoUrl(base64String);
        
        // Save to database
        await db.adminSettings.set('logo_url', { url: base64String });
        
        toast({
          title: "Logo Uploaded",
          description: "Logo has been saved successfully",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await db.adminSettings.set('design', {
        colors: { primaryColor, textColor, backgroundColor, secondaryColor },
        fonts: { headingFont, bodyFont },
        hero: { heroTitle, heroSubtitle, aboutTitle, aboutDescription }
      });
      
      toast({
        title: "Settings Saved",
        description: "Design settings have been updated successfully",
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
            <h1 className="text-2xl font-serif gold-text">Design & Branding</h1>
          </div>
          <GoldButton onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </GoldButton>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Colors Section */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Scheme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-20 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-20 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-20 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fonts Section */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text">Typography</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Heading Font</label>
              <select
                value={headingFont}
                onChange={(e) => setHeadingFont(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              >
                <option>Playfair Display</option>
                <option>Merriweather</option>
                <option>Lora</option>
                <option>Montserrat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Body Font</label>
              <select
                value={bodyFont}
                onChange={(e) => setBodyFont(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              >
                <option>Inter</option>
                <option>Open Sans</option>
                <option>Roboto</option>
                <option>Lato</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logos Section */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text">Logos & Branding</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Main Logo (used across all pages)</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <GoldButton variant="outline" type="button" onClick={() => document.getElementById('logo-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </GoldButton>
                </label>
                {logoUrl && (
                  <img src={logoUrl} alt="Logo preview" className="h-16 rounded-lg shadow-sm" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Recommended: PNG with transparent background, 200x80px</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-serif mb-6 gold-text">Hero Section Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Title</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">About Title</label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">About Description</label>
              <textarea
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDesign;
