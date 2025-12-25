/**
 * Entity Types
 * Core data models for the application
 */

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Feature entity
 */
export interface Feature extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
}

/**
 * Plan entity
 */
export interface Plan extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  price?: number;
  billingCycle?: "monthly" | "yearly";
  isActive: boolean;
}

/**
 * Plan feature configuration
 */
export interface PlanFeature {
  featureId: number;
  featureSlug: string;
  enabled: boolean;
  limitValue?: number;
}

/**
 * Plan with features
 */
export interface PlanWithFeatures extends Plan {
  features: PlanFeature[];
}

/**
 * Role entity
 */
export interface Role extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  organizationId: number;
  isSystemRole: boolean;
}

/**
 * Role permission configuration
 */
export interface RolePermission {
  featureId: number;
  featureSlug: string;
  enabled: boolean;
  limitValue?: number;
}

/**
 * Role with permissions
 */
export interface RoleWithPermissions extends Role {
  permissions: RolePermission[];
}

/**
 * Override entity
 */
export interface Override extends BaseEntity {
  userId?: number;
  organizationId?: number;
  featureSlug: string;
  overrideType: "feature_enable" | "feature_disable" | "limit_increase";
  value?: string;
  reason?: string;
  expiresAt?: string;
  createdBy?: number;
}

/**
 * Usage entity
 */
export interface Usage extends BaseEntity {
  userId: number;
  featureSlug: string;
  currentUsage: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  lastResetAt?: string;
}

/**
 * User entity (for admin views)
 */
export interface AdminUser extends BaseEntity {
  email: string;
  clerkId: string;
  orgId?: number;
  planId?: number;
  roles?: Role[];
  usage?: Usage[];
  overrides?: Override[];
}
