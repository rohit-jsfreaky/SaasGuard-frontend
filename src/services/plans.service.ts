/**
 * Plans Service
 * API methods for plan management
 */

import api from "./api";
import type { Plan, PlanWithFeatures, QueryParams } from "@/types";

/**
 * Plans API endpoints
 */
const ENDPOINTS = {
  base: "/api/v1/admin/plans",
  byId: (id: number) => `/api/v1/admin/plans/${id}`,
  features: (id: number) => `/api/v1/admin/plans/${id}/features`,
  limits: (id: number) => `/api/v1/admin/plans/${id}/limits`,
};

/**
 * Create plan payload
 */
export interface CreatePlanInput {
  name: string;
  slug: string;
  description?: string;
  price?: number;
  billingCycle?: "monthly" | "yearly";
}

/**
 * Update plan payload
 */
export interface UpdatePlanInput {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  billingCycle?: "monthly" | "yearly";
  isActive?: boolean;
}

/**
 * Plan feature configuration
 */
export interface PlanFeatureInput {
  featureId: number;
  enabled: boolean;
  limitValue?: number;
}

/**
 * Plans list response
 */
export interface PlansListResponse {
  plans: Plan[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Plans Service
 */
export const plansService = {
  /**
   * Get all plans with pagination
   */
  async getAll(params?: QueryParams) {
    return api.get<PlansListResponse>(ENDPOINTS.base, params);
  },

  /**
   * Get a single plan by ID
   */
  async getById(id: number) {
    return api.get<Plan>(ENDPOINTS.byId(id));
  },

  /**
   * Get plan with features
   */
  async getWithFeatures(id: number) {
    return api.get<PlanWithFeatures>(`${ENDPOINTS.byId(id)}?include=features`);
  },

  /**
   * Create a new plan
   */
  async create(data: CreatePlanInput) {
    return api.post<Plan>(ENDPOINTS.base, data);
  },

  /**
   * Update an existing plan
   */
  async update(id: number, data: UpdatePlanInput) {
    return api.put<Plan>(ENDPOINTS.byId(id), data);
  },

  /**
   * Delete a plan
   */
  async delete(id: number) {
    return api.delete<void>(ENDPOINTS.byId(id));
  },

  /**
   * Set plan features
   */
  async setFeatures(planId: number, features: PlanFeatureInput[]) {
    return api.put<void>(ENDPOINTS.features(planId), { features });
  },

  /**
   * Add feature to plan
   */
  async addFeature(
    planId: number,
    featureId: number,
    enabled: boolean = true,
    limitValue?: number
  ) {
    return api.post<void>(ENDPOINTS.features(planId), {
      featureId,
      enabled,
      limitValue,
    });
  },

  /**
   * Remove feature from plan
   */
  async removeFeature(planId: number, featureId: number) {
    return api.delete<void>(`${ENDPOINTS.features(planId)}/${featureId}`);
  },

  /**
   * Set plan limit for a feature
   */
  async setLimit(planId: number, featureSlug: string, limitValue: number) {
    return api.put<void>(ENDPOINTS.limits(planId), { featureSlug, limitValue });
  },
};

export default plansService;
