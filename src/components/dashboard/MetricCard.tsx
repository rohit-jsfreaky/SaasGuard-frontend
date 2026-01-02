import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function MetricCard({
  icon,
  label,
  value,
  trend,
  actionLabel,
  onAction,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-all duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center text-xs mt-2 font-medium",
              trend.direction === "up" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
            )}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 mr-1" />
            )}
            <span>{Math.abs(trend.value)}% from last month</span>
          </div>
        )}
        {actionLabel && onAction && (
          <Button
            variant="link"
            size="sm"
            className="mt-4 -ml-2 h-auto p-0 text-xs text-muted-foreground hover:text-primary"
            onClick={onAction}
          >
            {actionLabel}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}
