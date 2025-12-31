import { create } from "zustand";
import { overridesService } from "@/services/overrides.service";
import type { Override, OverrideType } from "@/types/entities";
import { toast } from "sonner";

interface OverridesState {
  overrides: Override[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  organizationId: number | null;
  statusFilter: "active" | "expired" | "all";
  tabType: "user" | "org";

  // Actions
  setOrganizationId: (orgId: number) => void;
  setStatusFilter: (status: "active" | "expired" | "all") => void;
  setTabType: (type: "user" | "org") => void;
  fetchOverrides: () => Promise<void>;
  createUserOverride: (data: {
    userId: number;
    featureSlug: string;
    overrideType: OverrideType;
    value?: number;
    expiresAt?: string | null;
    reason?: string;
  }) => Promise<boolean>;
  createOrgOverride: (data: {
    featureSlug: string;
    overrideType: OverrideType;
    value?: number;
    expiresAt?: string | null;
    reason?: string;
  }) => Promise<boolean>;
  updateOverride: (
    overrideId: number,
    data: {
      value?: number | null;
      expiresAt?: string | null;
      reason?: string;
    }
  ) => Promise<boolean>;
  deleteOverride: (overrideId: number) => Promise<boolean>;
  cleanupExpired: () => Promise<boolean>;
}

export const useOverridesStore = create<OverridesState>((set, get) => ({
  overrides: [],
  isLoading: false,
  error: null,
  hasFetched: false,
  organizationId: null,
  statusFilter: "active",
  tabType: "org",

  setOrganizationId: (orgId: number) => {
    set({ organizationId: orgId, hasFetched: false });
  },

  setStatusFilter: (status: "active" | "expired" | "all") => {
    set({ statusFilter: status, hasFetched: false });
    get().fetchOverrides();
  },

  setTabType: (type: "user" | "org") => {
    set({ tabType: type, hasFetched: false });
    get().fetchOverrides();
  },

  fetchOverrides: async () => {
    const { organizationId, statusFilter, tabType, isLoading } = get();

    if (!organizationId) {
      console.warn("No organization ID set");
      return;
    }

    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      let response;
      if (tabType === "org") {
        response = await overridesService.getOrgOverrides(organizationId);
      } else {
        // For user overrides, we get all and filter by status
        response = await overridesService.getAll({
          organizationId,
          status: statusFilter,
        });
        // Filter to only user-level overrides
        response.data = response.data.filter((o) => o.userId !== null);
      }

      // Apply status filter for org overrides
      let filteredOverrides = response.data;
      if (statusFilter !== "all") {
        filteredOverrides = response.data.filter((o) =>
          statusFilter === "active" ? !o.isExpired : o.isExpired
        );
      }

      set({
        overrides: filteredOverrides,
        hasFetched: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch overrides",
        isLoading: false,
        hasFetched: true, // Set to true even on error to prevent infinite retry
        overrides: [], // Clear overrides on error
      });
      toast.error("Failed to fetch overrides");
    }
  },

  createUserOverride: async (data) => {
    try {
      await overridesService.createUserOverride(data);
      toast.success("User override created successfully");
      get().fetchOverrides();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create user override");
      return false;
    }
  },

  createOrgOverride: async (data) => {
    const { organizationId } = get();
    if (!organizationId) {
      toast.error("No organization selected");
      return false;
    }

    try {
      await overridesService.createOrgOverride(organizationId, data);
      toast.success("Organization override created successfully");
      get().fetchOverrides();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create organization override");
      return false;
    }
  },

  updateOverride: async (overrideId, data) => {
    try {
      await overridesService.update(overrideId, data);
      toast.success("Override updated successfully");
      get().fetchOverrides();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update override");
      return false;
    }
  },

  deleteOverride: async (overrideId) => {
    try {
      await overridesService.delete(overrideId);
      toast.success("Override deleted successfully");
      get().fetchOverrides();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete override");
      return false;
    }
  },

  cleanupExpired: async () => {
    try {
      const response = await overridesService.cleanupExpired();
      toast.success(response.data.message || "Expired overrides cleaned up");
      get().fetchOverrides();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to cleanup expired overrides");
      return false;
    }
  },
}));
