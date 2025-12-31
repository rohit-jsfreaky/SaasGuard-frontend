export interface User {
  id: number;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organizationId?: number;
  roleId?: string;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  planId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feature {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: number;
  name: string;
  slug: string;
  description?: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  features?: PlanFeature[];
  featuresCount?: number;
}

export interface PlanFeature {
  id: number;
  name: string;
  slug: string;
  description?: string;
  enabled: boolean;
}

export interface PlanLimit {
  featureSlug: string;
  maxLimit: number;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  permissions?: string[];
  assignedAt?: string;
  permissionsCount?: number;
}

export type OverrideType =
  | "feature_enable"
  | "feature_disable"
  | "limit_increase";

export interface Override {
  id: number;
  userId: number | null;
  organizationId: number | null;
  featureSlug: string;
  overrideType: OverrideType;
  value: number | null;
  expiresAt: string | null;
  reason: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
  isPermanent: boolean;
}

export interface Usage {
  id: string;
  organizationId: number;
  featureId: string;
  value: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
}
