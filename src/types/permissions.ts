/**
 * Permission Types
 * Types for permission resolution and checks
 */

/**
 * Feature permission state
 */
export interface FeaturePermission {
  enabled: boolean;
  source?: "plan" | "role" | "override";
}

/**
 * Limit information for a feature
 */
export interface LimitInfo {
  max: number;
  used: number;
  remaining: number;
  exceeded: boolean;
}

/**
 * Complete permission map
 */
export interface PermissionMap {
  features: Record<string, boolean>;
  limits: Record<string, LimitInfo>;
  resolvedAt: string;
  userId: number;
  orgId: number;
  cached?: boolean;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  limit?: LimitInfo;
}

/**
 * Permission state for store
 */
export interface PermissionState {
  permissions: PermissionMap | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;
}
