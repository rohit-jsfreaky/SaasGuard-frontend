import { Shield, UserCheck, Clock, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { RecentActivity } from "@/services/dashboard.service";
import { cn } from "@/lib/utils";

interface RecentActivityListProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "override_created":
      return <Shield className="h-4 w-4" />;
    case "role_assigned":
      return <UserCheck className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

const getActivityBadge = (type: string) => {
  switch (type) {
    case "override_created":
      return (
        <Badge
          variant="outline"
          className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30"
        >
          Override
        </Badge>
      );
    case "role_assigned":
      return (
        <Badge
          variant="outline"
          className="text-xs bg-green-500/10 text-green-600 border-green-500/30"
        >
          Role
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          Activity
        </Badge>
      );
  }
};

export function RecentActivityList({
  activities,
  isLoading,
}: RecentActivityListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-lg border">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="h-10 w-10 mb-4 opacity-50" />
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={`${activity.type}-${activity.id}`}
          className={cn(
            "flex items-start gap-4 p-4 rounded-lg border",
            "hover:bg-accent/50 transition-colors cursor-default"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium leading-none truncate">
                {activity.description}
              </p>
              {getActivityBadge(activity.type)}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(activity.timestamp), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
