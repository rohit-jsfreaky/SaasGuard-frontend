import api from "./api.client";
import type { Plan, PlanFeature, PlanLimit } from "@/types/entities";

export const plansService = {
  // Get all plans for an organization
  getAll: (organizationId: number, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return api.get<Plan[]>(`/admin/organizations/${organizationId}/plans`, {
      params: { limit, offset },
    });
  },

  // Get a single plan with features
  getById: (planId: number) => api.get<Plan>(`/admin/plans/${planId}`),

  // Create a new plan
  create: (
    organizationId: number,
    data: { name: string; slug: string; description?: string }
  ) => api.post<Plan>(`/admin/organizations/${organizationId}/plans`, data),

  // Update a plan
  update: (planId: number, data: { name?: string; description?: string }) =>
    api.put<Plan>(`/admin/plans/${planId}`, data),

  // Delete a plan
  delete: (planId: number) => api.delete<void>(`/admin/plans/${planId}`),

  // Get plan features
  getFeatures: (planId: number) =>
    api.get<PlanFeature[]>(`/admin/plans/${planId}/features`),

  // Add feature to plan
  addFeature: (planId: number, featureId: number, enabled: boolean = true) =>
    api.post<{ message: string }>(`/admin/plans/${planId}/features`, {
      featureId,
      enabled,
    }),

  // Toggle feature enabled/disabled
  toggleFeature: (planId: number, featureId: number, enabled: boolean) =>
    api.put<{ message: string }>(
      `/admin/plans/${planId}/features/${featureId}`,
      { enabled }
    ),

  // Remove feature from plan
  removeFeature: (planId: number, featureId: number) =>
    api.delete<void>(`/admin/plans/${planId}/features/${featureId}`),

  // Get plan limits
  getLimits: (planId: number) =>
    api.get<PlanLimit[]>(`/admin/plans/${planId}/limits`),

  // Set feature limit
  setLimit: (planId: number, featureSlug: string, maxLimit: number) =>
    api.post<PlanLimit>(`/admin/plans/${planId}/limits`, {
      featureSlug,
      maxLimit,
    }),

  // Remove feature limit
  removeLimit: (planId: number, featureSlug: string) =>
    api.delete<void>(`/admin/plans/${planId}/limits/${featureSlug}`),
};
