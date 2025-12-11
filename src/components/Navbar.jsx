import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, LogOut, User, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";
import { dashboardAPI, coursesAPI, quizzesAPI } from "@/services/api";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({
    name: "User",
    level: 1,
    streak: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    totalXp: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Fetch user data and refresh periodically
  const fetchUserData = async () => {
    try {
      const data = await dashboardAPI.getStats();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserData({
        name: user.name || "User",
        level: data.level || 1,
        streak: data.streak || 0,
        avatar: user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
        totalXp: data.totalXp || 0,
      });
    } catch (error) {
      // If error, use stored user data
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.name) {
        setUserData({
          name: user.name,
          level: user.level || 1,
          streak: user.streak || 0,
          avatar: user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
          totalXp: user.totalXp || 0,
        });
      }
    }
  };

  // Fetch courses and quizzes for search
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const [coursesData, quizzesData] = await Promise.all([
          coursesAPI.getAll(),
          quizzesAPI.getAll(),
        ]);
        setCourses(coursesData);
        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Failed to fetch search data:", error);
      }
    };
    fetchSearchData();
  }, []);

  useEffect(() => {
    fetchUserData();
    // Refresh user data every 30 seconds to keep level/streak updated
    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = [];
      
      // Search courses
      courses.forEach((course) => {
        if (
          course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({
            type: "course",
            id: course._id || course.id,
            title: course.title,
            description: course.description,
            path: `/courses?search=${encodeURIComponent(searchQuery.toLowerCase())}`,
          });
        }
      });

      // Search quizzes
      quizzes.forEach((quiz) => {
        if (
          quiz.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quiz.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({
            type: "quiz",
            id: quiz._id || quiz.id,
            title: quiz.title,
            description: quiz.description,
            path: `/quizzes/${quiz._id || quiz.id}`,
          });
        }
      });

      setSearchResults(results.slice(0, 5)); // Limit to 5 results
      setShowSearchResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, courses, quizzes]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearchResultClick = (result) => {
    const searchTerm = searchQuery.trim();
    setSearchQuery("");
    setShowSearchResults(false);
    
    // Navigate with search query parameter
    navigate(result.path);
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-sm">
      {/* Search */}
      <div ref={searchRef} className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses, quizzes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim().length > 0 && setShowSearchResults(true)}
          className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        
        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-popover shadow-lg z-50 max-h-80 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSearchResultClick(result)}
                className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    result.type === "course" ? "bg-blue-500" : "bg-purple-500"
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{result.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {result.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {result.type}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {showSearchResults && searchQuery.trim().length > 0 && searchResults.length === 0 && (
          <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-popover shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
            No results found
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Level & Streak badges */}
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-eco-mint px-3 py-1.5">
            <p className="text-xs font-medium text-muted-foreground">LEVEL</p>
            <p className="text-sm font-bold text-foreground">#{userData.level}</p>
          </div>
          <div className="rounded-lg bg-eco-mint px-3 py-1.5">
            <p className="text-xs font-medium text-muted-foreground">STREAK</p>
            <p className="text-sm font-bold text-foreground">{userData.streak} days</p>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 transition-colors hover:bg-accent">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="h-9 w-9 rounded-full border-2 border-primary"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{userData.name}</p>
                <p className="text-xs text-muted-foreground">Level {userData.level}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="h-12 w-12 rounded-full border-2 border-primary"
                />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{userData.name}</p>
                  <p className="text-xs text-muted-foreground">Level {userData.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Streak</p>
                    <p className="text-sm font-semibold text-foreground">{userData.streak} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                    <p className="text-sm font-semibold text-foreground">{userData.totalXp.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
