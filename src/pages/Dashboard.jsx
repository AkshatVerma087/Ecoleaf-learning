import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EcoCard from "@/components/ui/EcoCard";
import XPProgressBar from "@/components/ui/XPProgressBar";
import StatCard from "@/components/ui/StatCard";
import { dashboardAPI } from "@/services/api";
import { toast } from "sonner";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await dashboardAPI.getStats();
      setUserData(data);
    } catch (error) {
      // If unauthorized, redirect to login
      if (error.message?.includes("401") || error.message?.includes("Not authorized")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }
      toast.error(error.message || "Failed to load dashboard");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh dashboard data every 30 seconds to keep it updated
    const interval = setInterval(fetchData, 30000);
    
    // Listen for refresh events from other pages (e.g., task completion)
    const handleRefresh = () => {
      fetchData();
    };
    window.addEventListener('dashboard-refresh', handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('dashboard-refresh', handleRefresh);
    };
  }, []);

  if (loading || !userData) {
    return <div className="animate-fade-in">Loading...</div>;
  }

  const streakDots = Array.from({ length: 7 }, (_, i) => i < Math.min(userData.streak % 7 || 7, 7));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Student Dashboard
        </p>
        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Keep your eco-learning streak alive.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track XP, levels, quizzes, and climate-friendly habits in one calm, focused space.
        </p>
      </div>

      {/* XP Progress & Streak */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <EcoCard className="lg:col-span-2" hover={false}>
          <h3 className="text-lg font-semibold text-foreground">XP progress</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {userData.xp.toLocaleString()} / {userData.xpToNextLevel.toLocaleString()} XP to the next level
          </p>
          <XPProgressBar
            current={userData.xp}
            total={userData.xpToNextLevel}
            showLabel={false}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Complete today's tasks and quizzes to keep your eco-momentum going.
          </p>
        </EcoCard>

        <EcoCard hover={false}>
          <h3 className="text-lg font-semibold text-foreground">Today's streak</h3>
          <p className="mb-3 text-sm text-muted-foreground">Don't break the chain.</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-foreground">{userData.streak}</span>
            <span className="text-muted-foreground">day streak</span>
          </div>
          <div className="mt-4 flex gap-1.5">
            {streakDots.map((active, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full transition-colors ${
                  active ? "bg-primary" : "bg-eco-sage/50"
                }`}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Log one sustainable action per day to keep your streak glowing.
          </p>
        </EcoCard>
      </div>

      {/* Weekly Stats */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">This week at a glance</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total XP"
            value={userData.totalXp.toLocaleString()}
            subtext="All-time earned"
          />
          <StatCard
            label="Tasks Completed"
            value={userData.tasksCompleted}
            subtext={`${userData.remainingTasks || 0} remaining for today`}
          />
          <StatCard
            label="Quizzes Passed"
            value={`${userData.quizzesPassed} / ${userData.totalQuizzes}`}
            subtext={userData.averageQuizScore > 0 ? `Average score ${userData.averageQuizScore}%` : "No quizzes completed yet"}
          />
          <StatCard
            label="Carbon Score"
            value={userData.carbonScore}
            subtext="Low-footprint learning"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/courses">
          <EcoCard className="cursor-pointer border-2 border-transparent hover:border-primary transition-all">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint text-2xl">
                📚
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Continue Learning</h3>
                <p className="text-sm text-muted-foreground">Resume your last course</p>
              </div>
            </div>
          </EcoCard>
        </Link>
        <Link to="/tasks">
          <EcoCard className="cursor-pointer border-2 border-transparent hover:border-primary transition-all">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint text-2xl">
                ✅
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Daily Tasks</h3>
                <p className="text-sm text-muted-foreground">{userData.remainingTasks || 0} tasks remaining</p>
              </div>
            </div>
          </EcoCard>
        </Link>
        <Link to="/quizzes">
          <EcoCard className="cursor-pointer border-2 border-transparent hover:border-primary transition-all">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint text-2xl">
                🧠
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Take a Quiz</h3>
                <p className="text-sm text-muted-foreground">Test your knowledge</p>
              </div>
            </div>
          </EcoCard>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
