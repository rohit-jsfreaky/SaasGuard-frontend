/**
 * Permissions Store
 * Zustand store for user permissions and entitlements
 */

import { create } from "zustand";
import type { PermissionMap, LimitInfo } from "@/types";
import { permissionsService } from "@/services";

/**
 * Usage info for a feature
 */
export interface UsageInfo {
  current: number;
  max: number;
  remaining: number;
  exceeded: boolean;
  lastUpdated: string;
}

/**
 * Cache configuration
 */
const CACHE_DURATION_MS = 60 * 1000; // 1 minute minimum between fetches
const AUTO_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes auto-refresh

/**
 * Permissions state interface
 */
interface PermissionsState {
  // State
  permissionMap: PermissionMap | null;
  usage: Record<string, UsageInfo>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  setPermissionMap: (permissions: PermissionMap) => void;
  setUsage: (usage: Record<string, UsageInfo>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refresh: (force?: boolean) => Promise<void>;
  clear: () => void;
  startAutoRefresh: () => () => void;

  // Helper methods
  can: (feature: string) => boolean;
  limit: (feature: string) => LimitInfo | null;
  hasFeature: (feature: string) => boolean;
  isLimitExceeded: (feature: string) => boolean;
  getUsage: (feature: string) => number;
}

/**
 * Permissions store
 */
export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  // Initial state
  permissionMap: null,
  usage: {},
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Actions
  setPermissionMap: (permissions) =>
    set({
      permissionMap: permissions,
      lastUpdated: new Date(),
      error: null,
    }),

  setUsage: (usage) => set({ usage }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  refresh: async (force = false) => {
    const { lastUpdated, isLoading } = get();

    // Skip if already loading
    if (isLoading) return;

    // Skip if recently fetched (unless forced)
    if (!force && lastUpdated) {
      const elapsed = Date.now() - lastUpdated.getTime();
      if (elapsed < CACHE_DURATION_MS) {
        return;
      }
    }

    set({ isLoading: true, error: null });

    try {
      const response = await permissionsService.getMyPermissions();
      const permissions = response.data;

      // Convert limits to usage info
      const usageMap: Record<string, UsageInfo> = {};
      if (permissions.limits) {
        Object.entries(permissions.limits).forEach(([feature, limit]) => {
          usageMap[feature] = {
            current: limit.used,
            max: limit.max,
            remaining: limit.remaining,
            exceeded: limit.exceeded,
            lastUpdated: new Date().toISOString(),
          };
        });
      }

      set({
        permissionMap: permissions,
        usage: usageMap,
        isLoading: false,
        lastUpdated: new Date(),
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch permissions",
        isLoading: false,
      });
    }
  },

  clear: () =>
    set({
      permissionMap: null,
      usage: {},
      isLoading: false,
      error: null,
      lastUpdated: null,
    }),

  startAutoRefresh: () => {
    // Initial fetch
    get().refresh();

    // Set up interval
    const intervalId = setInterval(() => {
      get().refresh();
    }, AUTO_REFRESH_INTERVAL_MS);

    // Return cleanup function
    return () => clearInterval(intervalId);
  },

  // Helper methods
  can: (feature) => {
    const { permissionMap } = get();
    if (!permissionMap?.features) return false;
    return permissionMap.features[feature] === true;
  },

  limit: (feature) => {
    const { permissionMap } = get();
    if (!permissionMap?.limits) return null;
    return permissionMap.limits[feature] ?? null;
  },

  hasFeature: (feature) => {
    const { permissionMap } = get();
    if (!permissionMap?.features) return false;
    return feature in permissionMap.features;
  },

  isLimitExceeded: (feature) => {
    const { usage } = get();
    return usage[feature]?.exceeded ?? false;
  },

  getUsage: (feature) => {
    const { usage } = get();
    return usage[feature]?.current ?? 0;
  },
}));

export default usePermissionsStore;
