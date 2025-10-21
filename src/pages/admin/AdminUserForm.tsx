import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const userSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  contact: z.string().trim().max(255, "Contact must be less than 255 characters").optional(),
  folder_path: z.string().trim().max(500, "Folder path must be less than 500 characters").optional(),
  selection_limit: z.number().int().min(1, "Must be at least 1").max(10000, "Must be less than 10,000"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal('')),
});

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
    
    // Validate input
    const validation = userSchema.safeParse({
      ...formData,
      password: formData.password || undefined,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive"
        });
        return;
      }

      const action = userId ? 'update' : 'create';
      
      if (action === 'create' && !formData.password) {
        toast({
          title: "Error",
          description: "Password is required for new users",
          variant: "destructive"
        });
        return;
      }

      const response = await supabase.functions.invoke('admin-user-management', {
        body: {
          action,
          userId,
          userData: {
            username: formData.username,
            name: formData.name,
            contact: formData.contact || undefined,
            folder_path: formData.folder_path || undefined,
            selection_limit: formData.selection_limit,
            password: formData.password || undefined,
          },
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to save user');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Success",
        description: userId ? "User updated successfully" : "User created successfully",
      });

      navigate('/admin/users');
    } catch (error: any) {
      console.error('User save error:', error);
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
              onChange={(e) => setFormData({ ...formData, selection_limit: parseInt(e.target.value) || 0 })}
              min="1"
              max="10000"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of photos this user can select (1-10,000)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserForm;
