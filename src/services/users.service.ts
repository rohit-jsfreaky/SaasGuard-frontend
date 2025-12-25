/**
 * Users Service
 * API methods for user management
 */

import api from "./api";
import type { AdminUser, Role, Override, Usage, QueryParams } from "@/types";

/**
 * Users API endpoints
 */
const ENDPOINTS = {
  base: "/api/v1/admin/users",
  byId: (id: number) => `/api/v1/admin/users/${id}`,
  roles: (id: number) => `/api/v1/admin/users/${id}/roles`,
  roleById: (userId: number, roleId: number) =>
    `/api/v1/admin/users/${userId}/roles/${roleId}`,
  usage: (id: number) => `/api/v1/admin/users/${id}/usage`,
  permissions: (id: number) => `/api/v1/admin/users/${id}/permissions`,
  overrides: (id: number) => `/api/v1/admin/users/${id}/overrides`,
  byOrg: (orgId: number) => `/api/v1/admin/organizations/${orgId}/users`,
};

/**
 * Users list response
 */
export interface UsersListResponse {
  users: AdminUser[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Users Service
 */
export const usersService = {
  /**
   * Get users in an organization
   */
  async getByOrganization(orgId: number, params?: QueryParams) {
    return api.get<UsersListResponse>(ENDPOINTS.byOrg(orgId), params);
  },

  /**
   * Get a single user by ID
   */
  async getById(id: number) {
    return api.get<AdminUser>(ENDPOINTS.byId(id));
  },

  /**
   * Get user details with related data
   */
  async getWithDetails(id: number) {
    return api.get<
      AdminUser & { roles: Role[]; usage: Usage[]; overrides: Override[] }
    >(`${ENDPOINTS.byId(id)}?include=roles,usage,overrides`);
  },

  /**
   * Get user's roles
   */
  async getRoles(userId: number) {
    return api.get<Role[]>(ENDPOINTS.roles(userId));
  },

  /**
   * Assign role to user
   */
  async assignRole(userId: number, roleId: number) {
    return api.post<void>(ENDPOINTS.roleById(userId, roleId));
  },

  /**
   * Remove role from user
   */
  async removeRole(userId: number, roleId: number) {
    return api.delete<void>(ENDPOINTS.roleById(userId, roleId));
  },

  /**
   * Get user's usage data
   */
  async getUsage(userId: number) {
    return api.get<Usage[]>(ENDPOINTS.usage(userId));
  },

  /**
   * Get user's resolved permissions
   */
  async getPermissions(userId: number) {
    return api.get<{
      features: Record<string, boolean>;
      limits: Record<string, { max: number; used: number; remaining: number }>;
    }>(ENDPOINTS.permissions(userId));
  },

  /**
   * Get user's overrides
   */
  async getOverrides(userId: number) {
    return api.get<Override[]>(ENDPOINTS.overrides(userId));
  },

  /**
   * Search users by email
   */
  async search(query: string, orgId?: number) {
    const params: Record<string, string | number> = { search: query };
    if (orgId) params["orgId"] = orgId;
    return api.get<UsersListResponse>(ENDPOINTS.base, params);
  },
};

export default usersService;
