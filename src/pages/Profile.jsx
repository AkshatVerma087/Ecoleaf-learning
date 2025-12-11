import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Award, Flame, TrendingUp, Calendar, Edit } from "lucide-react";
import EcoCard from "@/components/ui/EcoCard";
import StatCard from "@/components/ui/StatCard";
import XPProgressBar from "@/components/ui/XPProgressBar";
import { Button } from "@/components/ui/button";
import { dashboardAPI } from "@/services/api";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await dashboardAPI.getStats();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserData(data);
        setUserInfo(user);
      } catch (error) {
        if (error.message?.includes("401") || error.message?.includes("Not authorized")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }
        toast.error(error.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading || !userData || !userInfo) {
    return <div className="animate-fade-in">Loading profile...</div>;
  }

  const streakDots = Array.from({ length: 7 }, (_, i) => i < Math.min(userData.streak % 7 || 7, 7));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          User Profile
        </p>
        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Your Eco-Learning Journey
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track your progress, achievements, and sustainable impact.
        </p>
      </div>

      {/* Profile Header Card */}
      <EcoCard className="mb-8" hover={false}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <img
              src={userInfo.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
              alt={userInfo.name}
              className="h-32 w-32 rounded-full border-4 border-primary"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full cursor-pointer"
              onClick={() => toast.info("Profile picture editing coming soon!")}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-foreground">{userInfo.name}</h2>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                <span>{userInfo.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Member since {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : "Recently"}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-foreground">Level {userData.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-foreground">{userData.streak} day streak</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">{userData.totalXp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>
      </EcoCard>

      {/* XP Progress */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <EcoCard hover={false}>
          <h3 className="text-lg font-semibold text-foreground mb-4">XP Progress</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {userData.xp.toLocaleString()} / {userData.xpToNextLevel.toLocaleString()} XP to Level {userData.level + 1}
          </p>
          <XPProgressBar
            current={userData.xp}
            total={userData.xpToNextLevel}
            showLabel={false}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Keep learning to level up and unlock new achievements!
          </p>
        </EcoCard>

        <EcoCard hover={false}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Streak</h3>
          <p className="mb-3 text-sm text-muted-foreground">Your current learning streak</p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold text-foreground">{userData.streak}</span>
            <span className="text-muted-foreground">days</span>
          </div>
          <div className="flex gap-1.5 mb-4">
            {streakDots.map((active, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full transition-colors ${
                  active ? "bg-primary" : "bg-eco-sage/50"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Log in daily to maintain your streak and earn bonus XP!
          </p>
        </EcoCard>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Your Statistics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total XP"
            value={userData.totalXp.toLocaleString()}
            subtext="All-time earned"
          />
          <StatCard
            label="Tasks Completed"
            value={userData.tasksCompleted}
            subtext="Completed today"
          />
          <StatCard
            label="Quizzes Passed"
            value={`${userData.quizzesPassed} / ${userData.totalQuizzes}`}
            subtext={userData.averageQuizScore > 0 ? `Avg: ${userData.averageQuizScore}%` : "No quizzes yet"}
          />
          <StatCard
            label="Carbon Score"
            value={userData.carbonScore}
            subtext="Environmental impact"
          />
        </div>
      </div>

      {/* Achievements Section */}
      <EcoCard hover={false}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Achievements</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-eco-mint/50 cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
              <Award className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Level {userData.level}</p>
              <p className="text-xs text-muted-foreground">Current Level</p>
            </div>
          </div>
          
          {userData.streak >= 7 && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-eco-mint/50 cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">7 Day Streak</p>
                <p className="text-xs text-muted-foreground">Unlocked!</p>
              </div>
            </div>
          )}

          {userData.quizzesPassed > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-eco-mint/50 cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Quiz Master</p>
                <p className="text-xs text-muted-foreground">{userData.quizzesPassed} quizzes passed</p>
              </div>
            </div>
          )}
        </div>
      </EcoCard>
    </div>
  );
};

export default Profile;

