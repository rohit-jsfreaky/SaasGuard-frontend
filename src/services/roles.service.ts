import api from "./api.client";
import type { Role } from "@/types/entities";

export const rolesService = {
  // Get all roles for an organization
  getAll: (organizationId: number, page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    return api.get<Role[]>(`/admin/organizations/${organizationId}/roles`, {
      params: { limit, offset },
    });
  },

  // Get a single role with permissions
  getById: (roleId: number) => api.get<Role>(`/admin/roles/${roleId}`),

  // Create a new role
  create: (
    organizationId: number,
    data: { name: string; slug: string; description?: string }
  ) => api.post<Role>(`/admin/organizations/${organizationId}/roles`, data),

  // Update a role
  update: (roleId: number, data: { name?: string; description?: string }) =>
    api.put<Role>(`/admin/roles/${roleId}`, data),

  // Delete a role
  delete: (roleId: number) => api.delete<void>(`/admin/roles/${roleId}`),

  // Get role permissions
  getPermissions: (roleId: number) =>
    api.get<string[]>(`/admin/roles/${roleId}/permissions`),

  // Grant permissions to role (single or multiple)
  grantPermissions: (roleId: number, featureSlugs: string[]) =>
    api.post<{ message: string }>(`/admin/roles/${roleId}/permissions`, {
      featureSlugs,
    }),

  // Revoke permission from role
  revokePermission: (roleId: number, featureSlug: string) =>
    api.delete<void>(`/admin/roles/${roleId}/permissions/${featureSlug}`),

  // Get user roles
  getUserRoles: (userId: number, organizationId: number) =>
    api.get<Role[]>(`/admin/users/${userId}/roles`, {
      params: { organizationId },
    }),

  // Assign role to user
  assignRoleToUser: (userId: number, roleId: number, organizationId: number) =>
    api.post<{ message: string }>(`/admin/users/${userId}/roles`, {
      roleId,
      organizationId,
    }),

  // Remove role from user
  removeRoleFromUser: (
    userId: number,
    roleId: number,
    organizationId: number
  ) =>
    api.delete<void>(`/admin/users/${userId}/roles/${roleId}`, {
      params: { organizationId },
    }),
};
