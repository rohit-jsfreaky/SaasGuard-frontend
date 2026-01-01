import api from "./api.client";

// Types for usage
export interface UsageRecord {
  id?: number;
  userId: number;
  featureSlug: string;
  currentUsage: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeatureUsageStats {
  totalUsage: number;
  averageUsage: number;
  maxUsage: number;
  usersUsingIt: number;
}

export const usageService = {
  // Record usage increment
  recordUsage: (userId: number, featureSlug: string, amount: number = 1) =>
    api.post<UsageRecord>(`/admin/users/${userId}/usage/${featureSlug}`, {
      amount,
    }),

  // Get all usage records for user
  getUserUsage: (userId: number) =>
    api.get<UsageRecord[]>(`/admin/users/${userId}/usage`),

  // Get specific usage for feature
  getUsage: (userId: number, featureSlug: string) =>
    api.get<UsageRecord>(`/admin/users/${userId}/usage/${featureSlug}`),

  // Reset usage to 0
  resetUsage: (userId: number, featureSlug: string) =>
    api.post<{ message: string }>(
      `/admin/users/${userId}/usage/${featureSlug}/reset`
    ),

  // Reset all usage (monthly reset)
  resetAllUsage: () =>
    api.post<{ message: string; data: { resetCount: number } }>(
      "/admin/usage/reset-all"
    ),

  // Get feature usage statistics
  getFeatureUsageStats: (featureSlug: string) =>
    api.get<FeatureUsageStats>(`/admin/features/${featureSlug}/usage`),
};
