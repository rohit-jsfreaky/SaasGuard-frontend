/**
 * Dashboard Page
 * Main overview page with metrics and charts
 */

import { useDashboardData } from "@/hooks/useDashboardData";
import {
  MetricCard,
  PlanDistributionChart,
  FeatureUsageChart,
  RecentActivityList,
} from "@/components/dashboard";
import {
  Users,
  Briefcase,
  Component,
  Shield,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useOrganization } from "@/hooks/useOrganization";

export default function Dashboard() {
  const { orgId } = useOrganization();
  const { data, isLoading, error, refresh, lastUpdated } = useDashboardData();

  if (!orgId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="bg-muted p-4 rounded-full">
          <Briefcase className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">No Organization Selected</h2>
          <p className="text-muted-foreground max-w-sm mt-2">
            Please select an organization from the header to view metrics and
            mange your subscription.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error && !data) {
    // Show error state but try to render partial data if available?
    // For now simple error view
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="bg-red-500/10 p-4 rounded-full">
          <Shield className="h-8 w-8 text-red-500" />
        </div>
        <div className="text-lg font-medium">Failed to load dashboard</div>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => refresh()}>Try again</Button>
      </div>
    );
  }

  // Fallback default data if API returns null/empty (e.g. fresh install)
  const dashboardData = data || {
    totalUsers: 0,
    totalRoles: 0,
    totalFeatures: 0,
    activeOverridesCount: 0,
    planDistribution: {},
    topFeatures: [],
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your organization's subscription and usage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              Updated {format(lastUpdated, "p")}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => refresh()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={Users}
          description="Active users in organization"
          trend={{ value: 12, label: "vs last month", direction: "up" }}
        />
        <MetricCard
          title="Active Plans"
          value={
            Object.values(dashboardData.planDistribution).filter((v) => v > 0)
              .length
          } // Just a proxy for 'Types of plans active' or could look at totalPlans
          icon={Briefcase}
          description="Subscription tiers in use"
        />
        <MetricCard
          title="Total Features"
          value={dashboardData.totalFeatures}
          icon={Component}
          description="Registered system features"
        />
        <MetricCard
          title="Active Overrides"
          value={dashboardData.activeOverridesCount}
          icon={Shield}
          description="User-specific exceptions"
          trend={{ value: 5, label: "new this week", direction: "neutral" }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <FeatureUsageChart data={dashboardData.topFeatures} />
        </div>
        <div className="col-span-3">
          <PlanDistributionChart data={dashboardData.planDistribution} />
        </div>
      </div>

      {/* Activity Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentActivityList />
        </div>
        <div className="col-span-3">
          {/* Placeholder for another widget or tips */}
          <div className="rounded-xl border bg-card text-card-foreground shadow h-full p-6">
            <div className="flex flex-col space-y-1.5 pb-2">
              <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                <Activity className="h-4 w-4" />
                System Status
              </h3>
            </div>
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Status</span>
                <span className="flex items-center text-xs text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <span className="flex items-center text-xs text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Redis Cache</span>
                <span className="flex items-center text-xs text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                  Healthy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-9 w-[100px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[350px]" />
        <Skeleton className="col-span-3 h-[350px]" />
      </div>
    </div>
  );
}
