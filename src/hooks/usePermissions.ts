/**
 * usePermissions Hook
 * Access permission map and helper methods
 */

import { useEffect, useCallback } from "react";
import { usePermissionsStore } from "@/store/permissions.store";
import { useAuthStore } from "@/store/auth.store";
import type { LimitInfo } from "@/types";

/**
 * Permissions hook return type
 */
export interface UsePermissionsReturn {
  /** Check if user can access a feature */
  can: (feature: string) => boolean;
  /** Get limit info for a feature */
  limit: (feature: string) => LimitInfo | null;
  /** Check if feature exists in permission map */
  hasFeature: (feature: string) => boolean;
  /** Check if limit is exceeded */
  isLimitExceeded: (feature: string) => boolean;
  /** Get current usage for a feature */
  getUsage: (feature: string) => number;
  /** Whether permissions are loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Last time permissions were updated */
  lastUpdated: Date | null;
  /** Manually refresh permissions */
  refresh: () => Promise<void>;
}

/**
 * Hook to access permissions and entitlements
 */
export function usePermissions(): UsePermissionsReturn {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    can,
    limit,
    hasFeature,
    isLimitExceeded,
    getUsage,
    isLoading,
    error,
    lastUpdated,
    refresh,
    startAutoRefresh,
  } = usePermissionsStore();

  // Start auto-refresh when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const cleanup = startAutoRefresh();
    return cleanup;
  }, [isAuthenticated, startAutoRefresh]);

  // Wrapped refresh function
  const handleRefresh = useCallback(async () => {
    await refresh(true);
  }, [refresh]);

  return {
    can,
    limit,
    hasFeature,
    isLimitExceeded,
    getUsage,
    isLoading,
    error,
    lastUpdated,
    refresh: handleRefresh,
  };
}

/**
 * Hook to check a single permission
 */
export function useCanAccess(feature: string): boolean {
  const can = usePermissionsStore((state) => state.can);
  return can(feature);
}

/**
 * Hook to get limit info for a feature
 */
export function useFeatureLimit(feature: string): LimitInfo | null {
  const limit = usePermissionsStore((state) => state.limit);
  return limit(feature);
}

/**
 * Hook to check if limit is exceeded
 */
export function useLimitExceeded(feature: string): boolean {
  const isLimitExceeded = usePermissionsStore((state) => state.isLimitExceeded);
  return isLimitExceeded(feature);
}

export default usePermissions;
