import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { ElementType } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ElementType;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  onClick,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        onClick && "cursor-pointer active:scale-95",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trend && (
              <span
                className={cn(
                  "flex items-center mr-2 font-medium",
                  trend.direction === "up" &&
                    "text-emerald-600 dark:text-emerald-500",
                  trend.direction === "down" && "text-red-600 dark:text-red-500"
                )}
              >
                {trend.direction === "up" && (
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                )}
                {trend.direction === "down" && (
                  <ArrowDown className="h-3 w-3 mr-0.5" />
                )}
                {trend.direction === "neutral" && (
                  <Minus className="h-3 w-3 mr-0.5" />
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
