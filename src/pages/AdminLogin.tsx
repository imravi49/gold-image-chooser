import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Mail } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/services/database";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    checkSession();
  }, []);

  const checkSession = async () => {
    const user = await db.auth.getCurrentUser();
    if (user) {
      // Check if user is admin from Firestore user_roles collection
      const { getFirestore, doc, getDoc } = await import('firebase/firestore');
      const firestore = getFirestore();
      const roleDoc = await getDoc(doc(firestore, 'user_roles', user.uid));
      
      if (roleDoc.exists() && roleDoc.data().role === 'admin') {
        navigate('/admin');
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await db.auth.signIn(email, password);

      // Check if user has admin role
      const { getFirestore, doc, getDoc } = await import('firebase/firestore');
      const firestore = getFirestore();
      const roleDoc = await getDoc(doc(firestore, 'user_roles', user.uid));

      if (!roleDoc.exists() || roleDoc.data().role !== 'admin') {
        await db.auth.signOut();
        throw new Error("Access denied: Admin privileges required");
      }

      toast({
        title: "Welcome Admin!",
        description: "Successfully logged in to admin panel.",
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      
      // After Google login, check admin role
      const user = await db.auth.getCurrentUser();
      if (user) {
        const { getFirestore, doc, getDoc } = await import('firebase/firestore');
        const firestore = getFirestore();
        const roleDoc = await getDoc(doc(firestore, 'user_roles', user.uid));
        
        if (!roleDoc.exists() || roleDoc.data().role !== 'admin') {
          await db.auth.signOut();
          throw new Error("Access denied: Admin privileges required");
        }
        navigate('/admin');
      }
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen cinematic-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-soft rounded-2xl p-8 animate-fade-in-up">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full gold-gradient shadow-gold">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-serif text-center mb-2 gold-text">
            Admin Panel
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Secure Administrator Access
          </p>

          {/* Google Login */}
          <GoldButton
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full mb-6"
            variant="outline"
          >
            <Mail className="w-4 h-4 mr-2" />
            Sign in with Google
          </GoldButton>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-smooth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-smooth"
              />
            </div>

            <GoldButton
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Logging in..." : "Login as Admin"}
            </GoldButton>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
