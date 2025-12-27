export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  planId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feature {
  id: string;
  name: string;
  key: string;
  description?: string;
  type: 'boolean' | 'limit';
  defaultValue: string | number | boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Override {
  id: string;
  entityType: 'user' | 'organization';
  entityId: string;
  featureId: string;
  value: string | number | boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Usage {
  id: string;
  organizationId: string;
  featureId: string;
  value: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
}
