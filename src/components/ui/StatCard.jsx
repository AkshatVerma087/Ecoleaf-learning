import { cn } from "@/lib/utils";

const StatCard = ({ label, value, subtext, className }) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-eco-mint/50 p-4 transition-all duration-200 hover:bg-eco-mint",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{subtext}</p>
    </div>
  );
};

export default StatCard;
