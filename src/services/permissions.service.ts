/**
 * Permissions Service
 * API methods for permission resolution
 */

import api from "./api";
import type { PermissionMap, LimitInfo } from "@/types";

/**
 * Permissions API endpoints
 */
const ENDPOINTS = {
  myPermissions: "/api/v1/me/permissions",
  check: (featureSlug: string) => `/api/v1/me/permissions/check/${featureSlug}`,
  refresh: "/api/v1/me/permissions/refresh",
};

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  limit?: LimitInfo;
}

/**
 * Permissions Service
 */
export const permissionsService = {
  /**
   * Get current user's resolved permissions
   */
  async getMyPermissions() {
    return api.get<PermissionMap>(ENDPOINTS.myPermissions);
  },

  /**
   * Check if current user can access a specific feature
   */
  async checkPermission(featureSlug: string) {
    return api.get<PermissionCheckResult>(ENDPOINTS.check(featureSlug));
  },

  /**
   * Force refresh permissions (bypasses cache)
   */
  async refreshPermissions() {
    return api.post<PermissionMap>(ENDPOINTS.refresh);
  },

  /**
   * Check if a feature is enabled
   */
  async canAccess(featureSlug: string): Promise<boolean> {
    try {
      const result = await this.checkPermission(featureSlug);
      return result.data.allowed;
    } catch {
      return false;
    }
  },

  /**
   * Get limit info for a feature
   */
  async getLimitInfo(featureSlug: string): Promise<LimitInfo | null> {
    try {
      const result = await this.checkPermission(featureSlug);
      return result.data.limit ?? null;
    } catch {
      return null;
    }
  },
};

export default permissionsService;
