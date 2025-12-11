import { cn } from "@/lib/utils";

const XPProgressBar = ({ current, total, className, showLabel = true }) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-eco-green-light">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-eco-leaf transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted-foreground">
            {current.toLocaleString()} / {total.toLocaleString()} XP to the next level
          </span>
          <span className="font-semibold text-primary">{percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default XPProgressBar;
