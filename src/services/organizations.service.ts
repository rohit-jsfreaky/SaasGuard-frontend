/**
 * Organizations Service
 * API methods for organization management
 */

import api from "./api";
import type { Organization, AdminUser } from "@/types";

/**
 * Organizations API endpoints
 */
const ENDPOINTS = {
  base: "/api/v1/admin/organizations",
  byId: (id: number) => `/api/v1/admin/organizations/${id}`,
  admins: (id: number) => `/api/v1/admin/organizations/${id}/admins`,
  adminById: (orgId: number, userId: number) =>
    `/api/v1/admin/organizations/${orgId}/admins/${userId}`,
};

/**
 * Create organization payload
 */
export interface CreateOrganizationInput {
  name: string;
  slug?: string;
}

/**
 * Update organization payload
 */
export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
}

/**
 * Organizations Service
 */
export const organizationsService = {
  /**
   * Create a new organization
   */
  async create(data: CreateOrganizationInput) {
    return api.post<Organization>(ENDPOINTS.base, data);
  },

  /**
   * Get organization by ID
   */
  async getById(id: number) {
    return api.get<Organization>(ENDPOINTS.byId(id));
  },

  /**
   * Update organization
   */
  async update(id: number, data: UpdateOrganizationInput) {
    return api.put<Organization>(ENDPOINTS.byId(id), data);
  },

  /**
   * Get organization admins
   */
  async getAdmins(orgId: number) {
    return api.get<AdminUser[]>(ENDPOINTS.admins(orgId));
  },

  /**
   * Add admin to organization
   */
  async addAdmin(orgId: number, userId: number) {
    return api.post<void>(ENDPOINTS.admins(orgId), { userId });
  },

  /**
   * Remove admin from organization
   */
  async removeAdmin(orgId: number, userId: number) {
    return api.delete<void>(ENDPOINTS.adminById(orgId, userId));
  },
};

export default organizationsService;
