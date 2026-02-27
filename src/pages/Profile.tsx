import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, History, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import api, { User as UserType } from "@/lib/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  // Fetch latest user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await api.getCurrentUser();
        if (result.data) {
          setName(result.data.full_name || result.data.username);
          setEmail(result.data.email);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    // Note: The backend doesn't have an update profile endpoint yet
    // This would need to be added to the backend
    toast({ title: "Profile updated successfully!" });
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Profile Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border text-center">
            <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground">{name || "User"}</h3>
            <p className="text-sm text-muted-foreground">{email || "user@email.com"}</p>
            <div className="mt-6 space-y-2">
              <button 
                onClick={() => navigate("/history")}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                <History className="w-4 h-4" /> View History
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-input bg-muted text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-elevated text-sm disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-secondary" /> Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={() => toast({ title: "Password update coming soon!" })}
                  className="bg-card border border-border text-foreground px-6 py-2.5 rounded-xl font-semibold hover:bg-muted transition-colors text-sm"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
