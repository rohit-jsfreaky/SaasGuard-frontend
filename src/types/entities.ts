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

export interface Override {
  id: string;
  entityType: "user" | "organization";
  entityId: string; // This might be number if it refers to User/Org ID, but let's keep string for now or check usage.
  // Actually, if User.id is number, entityId should probably be number or string depending on implementation.
  // The prompt says "User/Org Name" in columns, but ID in backend.
  // Let's assume string for flexibility or number if strict.
  // Given User.id is number, let's make entityId string | number to be safe, or string if we cast.
  // Backend usually uses string for polymorphic IDs or specific columns.
  // Let's stick to string for IDs in general unless specified otherwise, but User/Org are numbers.
  // Let's use string | number for entityId to be safe.
  featureId: string;
  value: string | number | boolean;
  createdAt: string;
  updatedAt: string;
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
