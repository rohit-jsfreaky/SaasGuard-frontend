/**
 * Roles Service
 * API methods for role management
 */

import api from "./api";
import type { Role, RoleWithPermissions, QueryParams } from "@/types";

/**
 * Roles API endpoints
 */
const ENDPOINTS = {
  base: "/api/v1/admin/roles",
  byId: (id: number) => `/api/v1/admin/roles/${id}`,
  permissions: (id: number) => `/api/v1/admin/roles/${id}/permissions`,
  users: (id: number) => `/api/v1/admin/roles/${id}/users`,
};

/**
 * Create role payload
 */
export interface CreateRoleInput {
  name: string;
  slug: string;
  description?: string;
  organizationId: number;
}

/**
 * Update role payload
 */
export interface UpdateRoleInput {
  name?: string;
  slug?: string;
  description?: string;
}

/**
 * Role permission configuration
 */
export interface RolePermissionInput {
  featureId: number;
  enabled: boolean;
  limitValue?: number;
}

/**
 * Roles list response
 */
export interface RolesListResponse {
  roles: Role[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Roles Service
 */
export const rolesService = {
  /**
   * Get all roles with pagination
   */
  async getAll(params?: QueryParams & { organizationId?: number }) {
    return api.get<RolesListResponse>(ENDPOINTS.base, params);
  },

  /**
   * Get roles for an organization
   */
  async getByOrganization(orgId: number, params?: QueryParams) {
    return api.get<RolesListResponse>(ENDPOINTS.base, {
      ...params,
      organizationId: orgId,
    });
  },

  /**
   * Get a single role by ID
   */
  async getById(id: number) {
    return api.get<Role>(ENDPOINTS.byId(id));
  },

  /**
   * Get role with permissions
   */
  async getWithPermissions(id: number) {
    return api.get<RoleWithPermissions>(
      `${ENDPOINTS.byId(id)}?include=permissions`
    );
  },

  /**
   * Create a new role
   */
  async create(data: CreateRoleInput) {
    return api.post<Role>(ENDPOINTS.base, data);
  },

  /**
   * Update an existing role
   */
  async update(id: number, data: UpdateRoleInput) {
    return api.put<Role>(ENDPOINTS.byId(id), data);
  },

  /**
   * Delete a role
   */
  async delete(id: number) {
    return api.delete<void>(ENDPOINTS.byId(id));
  },

  /**
   * Get role permissions
   */
  async getPermissions(id: number) {
    return api.get<RoleWithPermissions["permissions"]>(
      ENDPOINTS.permissions(id)
    );
  },

  /**
   * Set role permissions
   */
  async setPermissions(roleId: number, permissions: RolePermissionInput[]) {
    return api.put<void>(ENDPOINTS.permissions(roleId), { permissions });
  },

  /**
   * Add permission to role
   */
  async addPermission(
    roleId: number,
    featureId: number,
    enabled: boolean = true
  ) {
    return api.post<void>(ENDPOINTS.permissions(roleId), {
      featureId,
      enabled,
    });
  },

  /**
   * Remove permission from role
   */
  async removePermission(roleId: number, featureId: number) {
    return api.delete<void>(`${ENDPOINTS.permissions(roleId)}/${featureId}`);
  },

  /**
   * Get users with this role
   */
  async getUsers(roleId: number) {
    return api.get<{ userId: number; email: string }[]>(
      ENDPOINTS.users(roleId)
    );
  },
};

export default rolesService;
