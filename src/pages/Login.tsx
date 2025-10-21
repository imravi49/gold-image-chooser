import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { GoldButton } from "@/components/GoldButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/services/database";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    checkUser();
  }, []);

  const checkUser = async () => {
    const user = await db.auth.getCurrentUser();
    if (user) {
      navigate("/hero");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in using username and password
      await db.auth.signIn(`${username}@gallery.app`, password);

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      navigate("/hero");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
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
            Ravi Sharma Photo & Films
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Select Your Beautiful Moments
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              {isLoading ? "Logging in..." : "Login"}
            </GoldButton>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact your photographer
            </p>
            <button
              onClick={() => navigate("/admin-login")}
              className="text-xs text-primary hover:underline"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
