import { Progress } from "@/components/ui/progress";
import {
  getUsageColor,
  getUsagePercentage,
  formatUsageDisplay,
} from "@/utils/usage-helpers";
import { cn } from "@/lib/utils";

interface UsageProgressBarProps {
  current: number;
  max: number | null;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UsageProgressBar({
  current,
  max,
  showLabel = true,
  size = "md",
  className,
}: UsageProgressBarProps) {
  const percentage = getUsagePercentage(current, max);
  const color = getUsageColor(percentage);

  const heightClass = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }[size];

  const colorClass = {
    green: "[&>div]:bg-green-500",
    yellow: "[&>div]:bg-yellow-500",
    red: "[&>div]:bg-red-500",
  }[color];

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-sm">
          <span className="text-muted-foreground">
            {formatUsageDisplay(current, max)}
          </span>
          <span
            className={cn(
              "font-medium",
              color === "green" && "text-green-600",
              color === "yellow" && "text-yellow-600",
              color === "red" && "text-red-600"
            )}
          >
            {max ? `${percentage.toFixed(0)}%` : "∞"}
          </span>
        </div>
      )}
      <Progress
        value={max ? percentage : 0}
        className={cn(heightClass, colorClass, "transition-all duration-300")}
        aria-label={`Usage: ${current} of ${max || "unlimited"}`}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max || 100}
      />
    </div>
  );
}
