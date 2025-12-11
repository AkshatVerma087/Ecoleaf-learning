import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { 
  LayoutDashboard, 
  Video, 
  HelpCircle, 
  Users, 
  LogOut,
  Shield 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Video, label: "Manage Lessons", path: "/admin/lessons" },
  { icon: HelpCircle, label: "Manage Quizzes", path: "/admin/quizzes" },
  { icon: Users, label: "Students", path: "/admin/students" },
];

const AdminLayout = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Check if user is logged in
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Check if user is admin
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-eco-forest">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-white/60">EcoBoard Management</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-1">
              {adminNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-white/10 px-4 py-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/admin/login";
              }}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 bg-background p-8">
        <Outlet />
      </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
