/**
 * Overrides Service
 * API methods for user override management
 */

import api from "./api";
import type { Override, QueryParams } from "@/types";

/**
 * Overrides API endpoints
 */
const ENDPOINTS = {
  base: "/api/v1/admin/overrides",
  byId: (id: number) => `/api/v1/admin/overrides/${id}`,
  byUser: (userId: number) => `/api/v1/admin/users/${userId}/overrides`,
};

/**
 * Override type
 */
export type OverrideType =
  | "feature_enable"
  | "feature_disable"
  | "limit_increase";

/**
 * Create override payload
 */
export interface CreateOverrideInput {
  userId: number;
  featureSlug: string;
  overrideType: OverrideType;
  value?: string;
  reason?: string;
  expiresAt?: string;
}

/**
 * Update override payload
 */
export interface UpdateOverrideInput {
  overrideType?: OverrideType;
  value?: string;
  reason?: string;
  expiresAt?: string;
}

/**
 * Overrides list response
 */
export interface OverridesListResponse {
  overrides: Override[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Overrides Service
 */
export const overridesService = {
  /**
   * Get all overrides with pagination
   */
  async getAll(
    params?: QueryParams & { userId?: number; featureSlug?: string }
  ) {
    return api.get<OverridesListResponse>(ENDPOINTS.base, params);
  },

  /**
   * Get overrides for a specific user
   */
  async getByUser(userId: number, params?: QueryParams) {
    return api.get<OverridesListResponse>(ENDPOINTS.byUser(userId), params);
  },

  /**
   * Get a single override by ID
   */
  async getById(id: number) {
    return api.get<Override>(ENDPOINTS.byId(id));
  },

  /**
   * Create a new override
   */
  async create(data: CreateOverrideInput) {
    return api.post<Override>(ENDPOINTS.base, data);
  },

  /**
   * Update an existing override
   */
  async update(id: number, data: UpdateOverrideInput) {
    return api.put<Override>(ENDPOINTS.byId(id), data);
  },

  /**
   * Delete an override
   */
  async delete(id: number) {
    return api.delete<void>(ENDPOINTS.byId(id));
  },

  /**
   * Delete all overrides for a user
   */
  async deleteByUser(userId: number) {
    return api.delete<void>(ENDPOINTS.byUser(userId));
  },

  /**
   * Get active overrides (not expired)
   */
  async getActive(params?: QueryParams) {
    return api.get<OverridesListResponse>(ENDPOINTS.base, {
      ...params,
      active: true,
    });
  },

  /**
   * Search overrides by feature
   */
  async searchByFeature(featureSlug: string, params?: QueryParams) {
    return api.get<OverridesListResponse>(ENDPOINTS.base, {
      ...params,
      featureSlug,
    });
  },
};

export default overridesService;
