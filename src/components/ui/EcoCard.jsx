import { cn } from "@/lib/utils";

const EcoCard = ({ className, children, hover = true, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card p-6 shadow-card transition-all duration-300",
        hover && "hover:shadow-hover hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default EcoCard;
