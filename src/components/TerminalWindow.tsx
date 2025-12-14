import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "green" | "red";
}

export const TerminalWindow = ({ 
  title = "terminal", 
  children, 
  className,
  variant = "green"
}: TerminalWindowProps) => {
  const borderColor = variant === "green" ? "border-primary/50" : "border-destructive/50";
  const titleColor = variant === "green" ? "text-primary" : "text-destructive";
  const dotColors = variant === "green" 
    ? ["bg-destructive", "bg-yellow-500", "bg-primary"]
    : ["bg-destructive", "bg-orange-500", "bg-destructive/50"];

  return (
    <div className={cn(
      "terminal-window rounded-sm overflow-hidden",
      borderColor,
      className
    )}>
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 border-b",
        borderColor,
        "bg-muted/50"
      )}>
        <div className="flex gap-1.5">
          {dotColors.map((color, i) => (
            <div key={i} className={cn("w-2.5 h-2.5 rounded-full", color)} />
          ))}
        </div>
        <span className={cn("font-mono text-xs tracking-wider", titleColor)}>
          {title}
        </span>
      </div>
      <div className="p-4 font-mono text-sm overflow-x-auto">
        {children}
      </div>
    </div>
  );
};
