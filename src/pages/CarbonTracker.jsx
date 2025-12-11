import { useState, useEffect } from "react";
import { Leaf, TrendingDown, Award, Plus } from "lucide-react";
import EcoCard from "@/components/ui/EcoCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { carbonAPI, dashboardAPI } from "@/services/api";

const emissionCategories = [
  { id: "transport", label: "Transportation", icon: "🚗" },
  { id: "food", label: "Food", icon: "🍽️" },
  { id: "energy", label: "Home Energy", icon: "💡" },
  { id: "shopping", label: "Shopping", icon: "🛒" },
];

const CarbonTracker = () => {
  const [emissions, setEmissions] = useState({
    transport: "",
    food: "",
    energy: "",
    shopping: "",
  });
  const [carbonData, setCarbonData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [avgDaily, setAvgDaily] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emissionsData, userData] = await Promise.all([
          carbonAPI.getEmissions(7),
          dashboardAPI.getStats(),
        ]);
        setCarbonData(emissionsData.chartData);
        setAvgDaily(emissionsData.average);
        setUserData(userData);
      } catch (error) {
        toast.error(error.message || "Failed to load carbon data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalEmissions = Object.values(emissions).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await carbonAPI.logEmissions(emissions);
      toast.success("Daily emissions logged successfully! 🌍");
      setEmissions({ transport: "", food: "", energy: "", shopping: "" });
      // Refresh data
      const emissionsData = await carbonAPI.getEmissions(7);
      setCarbonData(emissionsData.chartData);
      setAvgDaily(emissionsData.average);
      const userData = await dashboardAPI.getStats();
      setUserData(userData);
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('dashboard-refresh'));
    } catch (error) {
      toast.error(error.message || "Failed to log emissions");
    }
  };

  const getScoreBadge = (score) => {
    const badges = {
      "A+": { color: "bg-green-500", label: "Excellent" },
      A: { color: "bg-green-400", label: "Great" },
      "A-": { color: "bg-green-300", label: "Good" },
      B: { color: "bg-yellow-400", label: "Average" },
      C: { color: "bg-orange-400", label: "Needs Work" },
    };
    return badges[score] || badges["B"];
  };

  if (loading || !userData) {
    return <div className="animate-fade-in">Loading...</div>;
  }

  const badge = getScoreBadge(userData.carbonScore);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Carbon Emission Tracker</h1>
        <p className="mt-2 text-muted-foreground">
          Track your daily carbon footprint and work towards a greener lifestyle.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint">
            <TrendingDown className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{avgDaily.toFixed(1)} kg</p>
            <p className="text-sm text-muted-foreground">Avg Daily CO₂</p>
          </div>
        </EcoCard>
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">-15%</p>
            <p className="text-sm text-muted-foreground">vs Last Week</p>
          </div>
        </EcoCard>
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${badge.color}`}
          >
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{userData?.carbonScore || 'B'}</p>
            <p className="text-sm text-muted-foreground">{badge.label}</p>
          </div>
        </EcoCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        <EcoCard hover={false}>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Weekly Emissions (kg CO₂)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={carbonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="emissions"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </EcoCard>

        {/* Input Form */}
        <EcoCard hover={false}>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Log Today's Emissions
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {emissionCategories.map((category) => (
              <div key={category.id}>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="text-xl">{category.icon}</span>
                  {category.label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={emissions[category.id]}
                    onChange={(e) =>
                      setEmissions({ ...emissions, [category.id]: e.target.value })
                    }
                    placeholder="0.0"
                    className="h-11 w-full rounded-lg border border-input bg-background pl-4 pr-12 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    kg
                  </span>
                </div>
              </div>
            ))}
            <div className="rounded-lg bg-eco-mint/50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Total Today</span>
                <span className="text-xl font-bold text-primary">
                  {totalEmissions.toFixed(1)} kg CO₂
                </span>
              </div>
            </div>
            <Button type="submit" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Log Emissions
            </Button>
          </form>
        </EcoCard>
      </div>
    </div>
  );
};

export default CarbonTracker;
