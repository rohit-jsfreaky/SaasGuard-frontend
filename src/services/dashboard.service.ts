import api from "./api.client";

// Dashboard types
export interface DashboardMetrics {
  totalUsers: number;
  totalPlans: number;
  activeFeatures: number;
  activeOverrides: number;
}

export interface PlanDistribution {
  planId: number;
  planName: string;
  planSlug: string;
  userCount: number;
}

export interface TopFeature {
  featureSlug: string;
  featureName: string;
  usage: number;
  usersUsingIt: number;
}

export interface RecentActivity {
  type: "override_created" | "role_assigned";
  description: string;
  timestamp: string;
  id: number;
  featureSlug?: string;
  overrideType?: string;
  roleId?: number;
  roleName?: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  planDistribution: PlanDistribution[];
  topFeaturesByUsage: TopFeature[];
  recentActivity: RecentActivity[];
}

export const dashboardService = {
  getOverview: (organizationId: number) =>
    api.get<DashboardData>(`/admin/organizations/${organizationId}/overview`),
};
