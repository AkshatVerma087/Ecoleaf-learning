import { useState, useEffect } from "react";
import { Upload, Check, Flame, Star } from "lucide-react";
import EcoCard from "@/components/ui/EcoCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { tasksAPI, dashboardAPI } from "@/services/api";

const DailyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, userData] = await Promise.all([
          tasksAPI.getAll(),
          dashboardAPI.getStats(),
        ]);
        setTasks(tasksData);
        setUserData(userData);
      } catch (error) {
        toast.error(error.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalXP = tasks.reduce((sum, t) => (t.completed ? sum + t.xp : sum), 0);

  const handleComplete = async (taskId) => {
    try {
      const result = await tasksAPI.complete(taskId);
      setTasks((prev) =>
        prev.map((task) =>
          (task._id || task.id) === taskId ? { ...task, completed: true } : task
        )
      );
      if (result.leveledUp) {
        toast.success(`🎉 Level Up! You reached Level ${result.level}! +${result.xpEarned} XP earned 🌱`, {
          duration: 5000,
        });
      } else {
        toast.success(`Task completed! +${result.xpEarned} XP earned 🌱`);
      }
      // Refresh user data
      const userData = await dashboardAPI.getStats();
      setUserData(userData);
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('dashboard-refresh'));
    } catch (error) {
      toast.error(error.message || "Failed to complete task");
    }
  };

  const handleUpload = async (taskId) => {
    try {
      const result = await tasksAPI.uploadProof(taskId, "proof-url-placeholder");
      setTasks((prev) =>
        prev.map((task) =>
          (task._id || task.id) === taskId ? { ...task, completed: true } : task
        )
      );
      if (result.leveledUp) {
        toast.success(`🎉 Level Up! You reached Level ${result.level}! +${result.xpEarned} XP earned 🌱`, {
          duration: 5000,
        });
      } else {
        toast.success(`Proof uploaded! Task completed! +${result.xpEarned} XP earned 🌱`);
      }
      // Refresh user data
      const userData = await dashboardAPI.getStats();
      setUserData(userData);
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('dashboard-refresh'));
    } catch (error) {
      toast.error(error.message || "Failed to upload proof");
    }
  };

  if (loading || !userData) {
    return <div className="animate-fade-in">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Daily Tasks</h1>
        <p className="mt-2 text-muted-foreground">
          Complete eco-friendly tasks to earn XP and maintain your streak.
        </p>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {completedCount}/{tasks.length}
            </p>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
          </div>
        </EcoCard>
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint">
            <Star className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalXP}</p>
            <p className="text-sm text-muted-foreground">XP Earned Today</p>
          </div>
        </EcoCard>
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{userData?.streak || 0}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
        </EcoCard>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const taskId = task._id || task.id;
          return (
            <EcoCard
              key={taskId}
              className={`flex items-center justify-between ${
                task.completed ? "bg-eco-mint/30" : ""
              }`}
              hover={!task.completed}
            >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl text-3xl ${
                  task.completed ? "bg-primary/20" : "bg-eco-mint"
                }`}
              >
                {task.icon}
              </div>
              <div>
                <h3
                  className={`font-semibold ${
                    task.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-primary">+{task.xp} XP</p>
                {task.proofRequired && (
                  <p className="text-xs text-muted-foreground">Proof required</p>
                )}
              </div>
              {task.completed ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <Check className="h-5 w-5 text-primary-foreground" />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpload(taskId)}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              )}
            </div>
          </EcoCard>
          );
        })}
      </div>
    </div>
  );
};

export default DailyTasks;
