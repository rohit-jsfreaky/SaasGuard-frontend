import api from "./api.client";
import type { Override } from "@/types/entities";

interface CreateUserOverrideData {
  userId: number;
  featureSlug: string;
  overrideType: "feature_enable" | "feature_disable" | "limit_increase";
  value?: number;
  expiresAt?: string | null;
  reason?: string;
}

interface CreateOrgOverrideData {
  featureSlug: string;
  overrideType: "feature_enable" | "feature_disable" | "limit_increase";
  value?: number;
  expiresAt?: string | null;
  reason?: string;
}

interface UpdateOverrideData {
  value?: number | null;
  expiresAt?: string | null;
  reason?: string;
}

export const overridesService = {
  // List all overrides with filters
  getAll: (
    params: {
      featureSlug?: string;
      status?: "active" | "expired" | "all";
      organizationId?: number;
      limit?: number;
      offset?: number;
    } = {}
  ) => api.get<Override[]>("/admin/overrides", { params }),

  // Get override by ID
  getById: (overrideId: number) =>
    api.get<Override>(`/admin/overrides/${overrideId}`),

  // Create user-level override
  createUserOverride: (data: CreateUserOverrideData) =>
    api.post<Override>("/admin/overrides", data),

  // List user's overrides
  getUserOverrides: (userId: number) =>
    api.get<Override[]>(`/admin/overrides/users/${userId}/overrides`),

  // Create org-level override
  createOrgOverride: (organizationId: number, data: CreateOrgOverrideData) =>
    api.post<Override>(
      `/admin/organizations/${organizationId}/overrides`,
      data
    ),

  // List organization's overrides
  getOrgOverrides: (organizationId: number) =>
    api.get<Override[]>(`/admin/organizations/${organizationId}/overrides`),

  // Update override
  update: (overrideId: number, data: UpdateOverrideData) =>
    api.put<Override>(`/admin/overrides/${overrideId}`, data),

  // Update org override
  updateOrgOverride: (
    organizationId: number,
    overrideId: number,
    data: UpdateOverrideData
  ) =>
    api.put<Override>(
      `/admin/organizations/${organizationId}/overrides/${overrideId}`,
      data
    ),

  // Delete override
  delete: (overrideId: number) =>
    api.delete<void>(`/admin/overrides/${overrideId}`),

  // Delete org override
  deleteOrgOverride: (organizationId: number, overrideId: number) =>
    api.delete<void>(
      `/admin/organizations/${organizationId}/overrides/${overrideId}`
    ),

  // Cleanup expired overrides
  cleanupExpired: () =>
    api.post<{ message: string; data: { deletedCount: number } }>(
      "/admin/overrides/cleanup-expired"
    ),
};
