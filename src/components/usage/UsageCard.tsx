import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, RotateCcw, AlertTriangle } from "lucide-react";
import { UsageProgressBar } from "./UsageProgressBar";
import {
  getUsagePercentage,
  getRemainingUsage,
  getUsageStatusLabel,
  getUsageColor,
} from "@/utils/usage-helpers";
import { cn } from "@/lib/utils";

interface UsageCardProps {
  featureSlug: string;
  featureName?: string;
  currentUsage: number;
  limit: number | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  onReset?: () => void;
  showResetButton?: boolean;
}

export function UsageCard({
  featureSlug,
  featureName,
  currentUsage,
  limit,
  isLoading = false,
  onRefresh,
  onReset,
  showResetButton = false,
}: UsageCardProps) {
  const percentage = getUsagePercentage(currentUsage, limit);
  const remaining = getRemainingUsage(currentUsage, limit);
  const statusLabel = getUsageStatusLabel(percentage);
  const color = getUsageColor(percentage);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-2 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "transition-all",
        color === "red" && "border-red-500/50",
        color === "yellow" && "border-yellow-500/50"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">
            {featureName || featureSlug}
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            {featureSlug}
          </CardDescription>
        </div>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {showResetButton && onReset && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onReset}
              title="Reset Usage"
              className="text-destructive hover:text-destructive"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsageProgressBar current={currentUsage} max={limit} />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Used</p>
            <p className="font-mono font-medium">
              {currentUsage.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Remaining</p>
            <p className="font-mono font-medium">
              {remaining === Infinity ? "∞" : remaining.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn(
              color === "green" && "border-green-500 text-green-600",
              color === "yellow" && "border-yellow-500 text-yellow-600",
              color === "red" && "border-red-500 text-red-600"
            )}
          >
            {color !== "green" && <AlertTriangle className="mr-1 h-3 w-3" />}
            {statusLabel}
          </Badge>
          {limit && (
            <span className="text-xs text-muted-foreground">
              Limit: {limit.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
