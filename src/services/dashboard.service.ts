/**
 * Dashboard Service
 * API methods for admin dashboard analytics
 */

import api from "./api";

/**
 * Dashboard API endpoints
 */
const ENDPOINTS = {
  dashboard: (orgId: number) =>
    `/api/v1/admin/organizations/${orgId}/dashboard`,
  userStats: (orgId: number) =>
    `/api/v1/admin/organizations/${orgId}/stats/users`,
  roleStats: (orgId: number) =>
    `/api/v1/admin/organizations/${orgId}/stats/roles`,
  featureStats: (orgId: number) =>
    `/api/v1/admin/organizations/${orgId}/stats/features`,
  overview: (orgId: number) => `/api/v1/admin/organizations/${orgId}/overview`,
};

/**
 * Dashboard data
 */
export interface DashboardData {
  totalUsers: number;
  totalRoles: number;
  totalFeatures: number;
  planDistribution: Record<string, number>;
  topFeatures: { feature: string; usageCount: number; usagePercent: number }[];
  activeOverridesCount: number;
  recentOverrides?: {
    id: number;
    userId: number;
    featureSlug: string;
    createdAt: string;
  }[];
}

/**
 * User stats data
 */
export interface UserStats {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
  usersWithOverrides: number;
}

/**
 * Role stats data
 */
export interface RoleStats {
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  roleDistribution: { role: string; userCount: number }[];
}

/**
 * Feature usage stats
 */
export interface FeatureStats {
  totalFeatures: number;
  featuresInUse: number;
  topFeaturesByUsage: {
    featureSlug: string;
    usageCount: number;
    uniqueUsers: number;
  }[];
}

/**
 * Overview data
 */
export interface OverviewData {
  totalUsers: number;
  totalRoles: number;
  activeOverridesCount: number;
}

/**
 * Dashboard Service
 */
export const dashboardService = {
  /**
   * Get full dashboard data
   */
  async getDashboard(orgId: number) {
    return api.get<DashboardData>(ENDPOINTS.dashboard(orgId));
  },

  /**
   * Get user statistics
   */
  async getUserStats(orgId: number) {
    return api.get<UserStats>(ENDPOINTS.userStats(orgId));
  },

  /**
   * Get role statistics
   */
  async getRoleStats(orgId: number) {
    return api.get<RoleStats>(ENDPOINTS.roleStats(orgId));
  },

  /**
   * Get feature usage statistics
   */
  async getFeatureStats(orgId: number) {
    return api.get<FeatureStats>(ENDPOINTS.featureStats(orgId));
  },

  /**
   * Get organization overview
   */
  async getOverview(orgId: number) {
    return api.get<OverviewData>(ENDPOINTS.overview(orgId));
  },
};

export default dashboardService;
