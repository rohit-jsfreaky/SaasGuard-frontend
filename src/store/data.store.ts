/**
 * Data Store
 * Zustand store for managing entity data (features, plans, roles, users, overrides)
 */

import { create } from "zustand";
import type { Feature, Plan, Role, Override, AdminUser } from "@/types";
import {
  featuresService,
  plansService,
  rolesService,
  overridesService,
  usersService,
} from "@/services";

/**
 * Filter state for queries
 */
export interface FilterState {
  search: string;
  organizationId?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Entity types
 */
export type EntityType = "features" | "plans" | "roles" | "users" | "overrides";

/**
 * Data state interface
 */
interface DataState {
  // Entity data
  features: Feature[];
  plans: Plan[];
  roles: Role[];
  users: AdminUser[];
  overrides: Override[];

  // Loading states per entity
  loading: Record<EntityType, boolean>;

  // Error states per entity
  errors: Record<EntityType, string | null>;

  // Filter state
  filters: FilterState;

  // Feature actions
  setFeatures: (features: Feature[]) => void;
  addFeature: (feature: Feature) => void;
  updateFeature: (id: number, updates: Partial<Feature>) => void;
  deleteFeature: (id: number) => void;
  fetchFeatures: () => Promise<void>;

  // Plan actions
  setPlans: (plans: Plan[]) => void;
  addPlan: (plan: Plan) => void;
  updatePlan: (id: number, updates: Partial<Plan>) => void;
  deletePlan: (id: number) => void;
  fetchPlans: (orgId?: number) => Promise<void>;

  // Role actions
  setRoles: (roles: Role[]) => void;
  addRole: (role: Role) => void;
  updateRole: (id: number, updates: Partial<Role>) => void;
  deleteRole: (id: number) => void;
  fetchRoles: (orgId?: number) => Promise<void>;

  // User actions
  setUsers: (users: AdminUser[]) => void;
  fetchUsers: (orgId: number) => Promise<void>;

  // Override actions
  setOverrides: (overrides: Override[]) => void;
  addOverride: (override: Override) => void;
  updateOverride: (id: number, updates: Partial<Override>) => void;
  deleteOverride: (id: number) => void;
  fetchOverrides: () => Promise<void>;

  // Utility actions
  setLoading: (entity: EntityType, loading: boolean) => void;
  setError: (entity: EntityType, error: string | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  clearAll: () => void;

  // Selectors
  selectFeatureById: (id: number) => Feature | undefined;
  selectFeatureBySlug: (slug: string) => Feature | undefined;
  selectPlanById: (id: number) => Plan | undefined;
  selectRoleById: (id: number) => Role | undefined;
  selectRolesByOrg: (orgId: number) => Role[];
  selectUsersByOrg: (orgId: number) => AdminUser[];
  selectOverridesByUser: (userId: number) => Override[];
  selectActiveOverrides: () => Override[];
}

/**
 * Initial filter state
 */
const initialFilters: FilterState = {
  search: "",
  organizationId: undefined,
  sortBy: undefined,
  sortOrder: "asc",
};

/**
 * Initial loading states
 */
const initialLoading: Record<EntityType, boolean> = {
  features: false,
  plans: false,
  roles: false,
  users: false,
  overrides: false,
};

/**
 * Initial error states
 */
const initialErrors: Record<EntityType, string | null> = {
  features: null,
  plans: null,
  roles: null,
  users: null,
  overrides: null,
};

/**
 * Data store
 */
export const useDataStore = create<DataState>((set, get) => ({
  // Initial state
  features: [],
  plans: [],
  roles: [],
  users: [],
  overrides: [],
  loading: { ...initialLoading },
  errors: { ...initialErrors },
  filters: { ...initialFilters },

  // Feature actions
  setFeatures: (features) => set({ features }),

  addFeature: (feature) =>
    set((state) => ({ features: [...state.features, feature] })),

  updateFeature: (id, updates) =>
    set((state) => ({
      features: state.features.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),

  deleteFeature: (id) =>
    set((state) => ({
      features: state.features.filter((f) => f.id !== id),
    })),

  fetchFeatures: async () => {
    const { setLoading, setError, setFeatures, filters } = get();
    setLoading("features", true);
    setError("features", null);

    try {
      const response = await featuresService.getAll({
        search: filters.search || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setFeatures(response.data.features);
    } catch (error) {
      setError(
        "features",
        error instanceof Error ? error.message : "Failed to fetch features"
      );
    } finally {
      setLoading("features", false);
    }
  },

  // Plan actions
  setPlans: (plans) => set({ plans }),

  addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),

  updatePlan: (id, updates) =>
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  deletePlan: (id) =>
    set((state) => ({
      plans: state.plans.filter((p) => p.id !== id),
    })),

  fetchPlans: async (orgId) => {
    const { setLoading, setError, setPlans, filters } = get();
    setLoading("plans", true);
    setError("plans", null);

    try {
      // If orgId is provided, we might want to filter by it if plans are org-specific
      // Currently plans might be global, but let's support the pattern
      // Assuming plansService.getAll respects some filtering or returns all valid plans
      const response = await plansService.getAll({
        search: filters.search || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        organizationId: orgId,
      });
      setPlans(response.data.plans);
    } catch (error) {
      setError(
        "plans",
        error instanceof Error ? error.message : "Failed to fetch plans"
      );
    } finally {
      setLoading("plans", false);
    }
  },

  // Role actions
  setRoles: (roles) => set({ roles }),

  addRole: (role) => set((state) => ({ roles: [...state.roles, role] })),

  updateRole: (id, updates) =>
    set((state) => ({
      roles: state.roles.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),

  deleteRole: (id) =>
    set((state) => ({
      roles: state.roles.filter((r) => r.id !== id),
    })),

  fetchRoles: async (orgId) => {
    const { setLoading, setError, setRoles, filters } = get();
    setLoading("roles", true);
    setError("roles", null);

    try {
      const response = await rolesService.getAll({
        organizationId: orgId || filters.organizationId,
        search: filters.search || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setRoles(response.data.roles);
    } catch (error) {
      setError(
        "roles",
        error instanceof Error ? error.message : "Failed to fetch roles"
      );
    } finally {
      setLoading("roles", false);
    }
  },

  // User actions
  setUsers: (users) => set({ users }),

  fetchUsers: async (orgId) => {
    const { setLoading, setError, setUsers, filters } = get();
    setLoading("users", true);
    setError("users", null);

    try {
      const response = await usersService.getByOrganization(orgId, {
        search: filters.search || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setUsers(response.data.users);
    } catch (error) {
      setError(
        "users",
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    } finally {
      setLoading("users", false);
    }
  },

  // Override actions
  setOverrides: (overrides) => set({ overrides }),

  addOverride: (override) =>
    set((state) => ({ overrides: [...state.overrides, override] })),

  updateOverride: (id, updates) =>
    set((state) => ({
      overrides: state.overrides.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      ),
    })),

  deleteOverride: (id) =>
    set((state) => ({
      overrides: state.overrides.filter((o) => o.id !== id),
    })),

  fetchOverrides: async () => {
    const { setLoading, setError, setOverrides, filters } = get();
    setLoading("overrides", true);
    setError("overrides", null);

    try {
      const response = await overridesService.getAll({
        search: filters.search || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setOverrides(response.data.overrides);
    } catch (error) {
      setError(
        "overrides",
        error instanceof Error ? error.message : "Failed to fetch overrides"
      );
    } finally {
      setLoading("overrides", false);
    }
  },

  // Utility actions
  setLoading: (entity, loading) =>
    set((state) => ({
      loading: { ...state.loading, [entity]: loading },
    })),

  setError: (entity, error) =>
    set((state) => ({
      errors: { ...state.errors, [entity]: error },
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () => set({ filters: { ...initialFilters } }),

  clearAll: () =>
    set({
      features: [],
      plans: [],
      roles: [],
      users: [],
      overrides: [],
      loading: { ...initialLoading },
      errors: { ...initialErrors },
      filters: { ...initialFilters },
    }),

  // Selectors
  selectFeatureById: (id) => get().features.find((f) => f.id === id),

  selectFeatureBySlug: (slug) => get().features.find((f) => f.slug === slug),

  selectPlanById: (id) => get().plans.find((p) => p.id === id),

  selectRoleById: (id) => get().roles.find((r) => r.id === id),

  selectRolesByOrg: (orgId) =>
    get().roles.filter((r) => r.organizationId === orgId),

  selectUsersByOrg: (orgId) => get().users.filter((u) => u.orgId === orgId),

  selectOverridesByUser: (userId) =>
    get().overrides.filter((o) => o.userId === userId),

  selectActiveOverrides: () => {
    const now = new Date();
    return get().overrides.filter((o) => {
      if (!o.expiresAt) return true;
      return new Date(o.expiresAt) > now;
    });
  },
}));

export default useDataStore;
