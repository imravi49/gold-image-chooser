import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";

const AdminUserForm = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    contact: '',
    folder_path: '',
    selection_limit: 150,
    password: ''
  });

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const user = await db.users.getById(userId!);
      if (user) {
        setFormData({
          username: user.username,
          name: user.name,
          contact: user.contact || '',
          folder_path: user.folder_path || '',
          selection_limit: user.selection_limit,
          password: '' // Never pre-fill password
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (userId) {
        // Update existing user
        const updateData: any = {
          username: formData.username,
          name: formData.name,
          contact: formData.contact,
          folder_path: formData.folder_path,
          selection_limit: formData.selection_limit
        };

        // Only update password if provided
        if (formData.password) {
          // Hash password (in production, use proper bcrypt)
          updateData.password_hash = formData.password;
        }

        await db.users.update(userId, updateData);
        
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        // Create new user
        if (!formData.password) {
          toast({
            title: "Error",
            description: "Password is required for new users",
            variant: "destructive"
          });
          return;
        }

        await db.users.create({
          username: formData.username,
          name: formData.name,
          password_hash: formData.password,
          contact: formData.contact,
          folder_path: formData.folder_path,
          selection_limit: formData.selection_limit
        } as any);
        
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }

      navigate('/admin/users');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
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
            <GoldButton variant="outline" onClick={() => navigate('/admin/users')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </GoldButton>
            <h1 className="text-2xl font-serif gold-text">
              {userId ? 'Edit User' : 'Add New User'}
            </h1>
          </div>
          <GoldButton onClick={handleSubmit} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save User
          </GoldButton>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-soft space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="john_doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {userId ? '(leave blank to keep current)' : '*'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!userId}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact (Email/Phone)</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="john@example.com or +1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder_path">Folder Path (Google Drive)</Label>
            <Input
              id="folder_path"
              value={formData.folder_path}
              onChange={(e) => setFormData({ ...formData, folder_path: e.target.value })}
              placeholder="/Wedding_Photos/John_Doe"
            />
            <p className="text-xs text-muted-foreground">
              Path to user's photo folder in Google Drive
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="selection_limit">Selection Limit</Label>
            <Input
              id="selection_limit"
              type="number"
              value={formData.selection_limit}
              onChange={(e) => setFormData({ ...formData, selection_limit: parseInt(e.target.value) })}
              min="1"
              max="1000"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserForm;
