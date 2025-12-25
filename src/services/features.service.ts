/**
 * Features Service
 * API methods for feature registry management
 */

import api from "./api";
import type { Feature, QueryParams } from "@/types";

/**
 * Features API endpoints
 */
const ENDPOINTS = {
  base: "/api/v1/admin/features",
  byId: (id: number) => `/api/v1/admin/features/${id}`,
};

/**
 * Create feature payload
 */
export interface CreateFeatureInput {
  name: string;
  slug: string;
  description?: string;
}

/**
 * Update feature payload
 */
export interface UpdateFeatureInput {
  name?: string;
  slug?: string;
  description?: string;
}

/**
 * Features list response
 */
export interface FeaturesListResponse {
  features: Feature[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Features Service
 */
export const featuresService = {
  /**
   * Get all features with pagination
   */
  async getAll(params?: QueryParams) {
    return api.get<FeaturesListResponse>(ENDPOINTS.base, params);
  },

  /**
   * Get a single feature by ID
   */
  async getById(id: number) {
    return api.get<Feature>(ENDPOINTS.byId(id));
  },

  /**
   * Get a feature by slug
   */
  async getBySlug(slug: string) {
    return api.get<Feature>(`${ENDPOINTS.base}/slug/${slug}`);
  },

  /**
   * Create a new feature
   */
  async create(data: CreateFeatureInput) {
    return api.post<Feature>(ENDPOINTS.base, data);
  },

  /**
   * Update an existing feature
   */
  async update(id: number, data: UpdateFeatureInput) {
    return api.put<Feature>(ENDPOINTS.byId(id), data);
  },

  /**
   * Delete a feature
   */
  async delete(id: number) {
    return api.delete<void>(ENDPOINTS.byId(id));
  },

  /**
   * Search features
   */
  async search(query: string, params?: Omit<QueryParams, "search">) {
    return api.get<FeaturesListResponse>(ENDPOINTS.base, {
      ...params,
      search: query,
    });
  },
};

export default featuresService;
