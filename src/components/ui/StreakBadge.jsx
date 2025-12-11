import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const StreakBadge = ({ streak, size = "default", className }) => {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    default: "h-12 w-12 text-lg",
    lg: "h-16 w-16 text-xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-eco-mint",
          sizes[size]
        )}
      >
        <Flame className="h-5 w-5 text-orange-500" />
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground">{streak}</p>
        <p className="text-sm text-muted-foreground">day streak</p>
      </div>
    </div>
  );
};

export default StreakBadge;
