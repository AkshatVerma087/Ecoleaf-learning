import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authAPI } from "@/services/api";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authAPI.login(formData);
      
      // Double check - if somehow an admin got through, redirect them
      if (data.role === 'admin') {
        toast.error("Admin users must use the admin login portal");
        navigate("/admin/login");
        return;
      }
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Welcome back! 🌱");
      navigate("/dashboard");
    } catch (error) {
      // If error mentions admin, redirect to admin login
      if (error.message?.includes("admin") || error.message?.includes("Admin")) {
        toast.error("Admin users must use the admin login portal");
        navigate("/admin/login");
      } else {
        toast.error(error.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center eco-gradient p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to EcoBoard</h1>
          <p className="mt-2 text-muted-foreground">Sign in to continue your eco-journey</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-card p-8 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-12 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="h-12 w-full text-base" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <Link to="/admin/login">
              <Button variant="ghost" className="w-full text-muted-foreground">
                Admin Login →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
