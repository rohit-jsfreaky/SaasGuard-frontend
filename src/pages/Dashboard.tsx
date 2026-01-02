import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  Zap,
  Shield,
  RefreshCw,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MetricCard,
  MetricCardSkeleton,
} from "@/components/dashboard/MetricCard";
import { PlanDistributionChart } from "@/components/dashboard/PlanDistributionChart";
import { FeatureUsageChart } from "@/components/dashboard/FeatureUsageChart";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error, refresh, organizationId } =
    useDashboardData();

  // No organization selected
  if (!organizationId) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Organization Selected</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-md">
          To view the dashboard, you need to select or create an organization.
          Use the organization dropdown in the header.
        </p>
      </div>
    );
  }

  // Error state
  if (error && !isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your organization</p>
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            Failed to load dashboard data. {error}
          </AlertDescription>
        </Alert>

        <Button onClick={refresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto w-full animate-in fade-in-50">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your organization</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px]" />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px]" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full animate-in fade-in-50">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your organization</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users className="h-4 w-4" />}
          label="Total Users"
          value={data?.metrics.totalUsers || 0}
          actionLabel="View Users"
          onAction={() => navigate("/users")}
        />
        <MetricCard
          icon={<Package className="h-4 w-4" />}
          label="Total Plans"
          value={data?.metrics.totalPlans || 0}
          actionLabel="View Plans"
          onAction={() => navigate("/plans")}
        />
        <MetricCard
          icon={<Zap className="h-4 w-4" />}
          label="Active Features"
          value={data?.metrics.activeFeatures || 0}
          actionLabel="View Features"
          onAction={() => navigate("/features")}
        />
        <MetricCard
          icon={<Shield className="h-4 w-4" />}
          label="Active Overrides"
          value={data?.metrics.activeOverrides || 0}
          actionLabel="View Overrides"
          onAction={() => navigate("/overrides")}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Users per plan</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <PlanDistributionChart
              data={data?.planDistribution || []}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Features by Usage</CardTitle>
            <CardDescription>Most used features</CardDescription>
          </CardHeader>
          <CardContent>
            <FeatureUsageChart
              data={data?.topFeaturesByUsage || []}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest changes in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivityList
            activities={data?.recentActivity || []}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
