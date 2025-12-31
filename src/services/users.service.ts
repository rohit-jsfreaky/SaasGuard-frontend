import api from "./api.client";
import type { User, Plan, Role, Override } from "@/types/entities";

// Types for user permissions response
export interface UserPermissions {
  features: Record<string, boolean>;
  limits: Record<string, { max: number; used: number; remaining: number }>;
  resolvedAt: string;
}

export const usersService = {
  // Sync user with Clerk
  sync: (clerkId: string, email: string, organizationId?: number) =>
    api.post<User>("/users/sync", { clerkId, email, organizationId }),

  // Get current user
  getCurrent: () => api.get<User>("/users/me"),

  // Get user by ID
  getById: (userId: number) => api.get<User>(`/users/${userId}`),

  // List users by organization
  getByOrganization: (orgId: number, limit = 50, offset = 0) =>
    api.get<User[]>(`/organizations/${orgId}/users`, {
      params: { limit, offset },
    }),

  // Update user
  update: (userId: number, updates: { email?: string }) =>
    api.put<User>(`/users/${userId}`, updates),

  // Delete user
  delete: (userId: number) => api.delete<void>(`/users/${userId}`),

  // Get user's plan
  getUserPlan: (userId: number, organizationId: number) =>
    api.get<Plan | null>(`/users/${userId}/plan`, {
      params: { organizationId },
    }),

  // Assign plan to user
  assignPlan: (userId: number, planId: number, organizationId: number) =>
    api.post<{ plan: Plan }>(`/admin/users/${userId}/plan`, {
      planId,
      organizationId,
    }),

  // Remove plan from user
  removePlan: (userId: number, organizationId: number) =>
    api.delete<void>(`/admin/users/${userId}/plan`, {
      params: { organizationId },
    }),

  // Get user roles
  getUserRoles: (userId: number, organizationId: number) =>
    api.get<Role[]>(`/admin/users/${userId}/roles`, {
      params: { organizationId },
    }),

  // Assign role to user
  assignRole: (userId: number, roleId: number, organizationId: number) =>
    api.post<{ message: string }>(`/admin/users/${userId}/roles`, {
      roleId,
      organizationId,
    }),

  // Remove role from user
  removeRole: (userId: number, roleId: number, organizationId: number) =>
    api.delete<void>(`/admin/users/${userId}/roles/${roleId}`, {
      params: { organizationId },
    }),

  // Get user permissions (resolved)
  getUserPermissions: (userId: number, organizationId: number) =>
    api.get<UserPermissions>(`/users/${userId}/permissions`, {
      params: { organizationId },
    }),

  // Get current user permissions
  getMyPermissions: (organizationId: number) =>
    api.get<UserPermissions>("/me/permissions", {
      params: { organizationId },
    }),

  // Get user overrides
  getUserOverrides: (userId: number) =>
    api.get<Override[]>(`/admin/overrides/users/${userId}/overrides`),
};
