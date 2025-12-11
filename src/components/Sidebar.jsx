import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  HelpCircle, 
  Leaf, 
  Info,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: CheckSquare, label: "Daily Tasks", path: "/tasks" },
  { icon: HelpCircle, label: "Quizzes", path: "/quizzes" },
  { icon: BarChart3, label: "Carbon Tracker", path: "/carbon" },
  { icon: Info, label: "About", path: "/about" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 sidebar-gradient border-r border-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">EcoBoard</h1>
            <p className="text-xs text-muted-foreground">Sustainable insights</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
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

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Leaf className="h-4 w-4 text-primary" />
            Designed to feel light on the planet.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
