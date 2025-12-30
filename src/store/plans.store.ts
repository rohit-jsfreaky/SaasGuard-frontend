import { create } from "zustand";
import { plansService } from "@/services/plans.service";
import type { Plan } from "@/types/entities";
import { toast } from "sonner";

interface PlansState {
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  search: string;
  hasFetched: boolean;
  organizationId: number | null;

  // Actions
  setOrganizationId: (orgId: number) => void;
  fetchPlans: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  addPlan: (data: {
    name: string;
    slug: string;
    description?: string;
  }) => Promise<boolean>;
  updatePlan: (
    planId: number,
    data: { name?: string; description?: string }
  ) => Promise<boolean>;
  removePlan: (planId: number) => Promise<boolean>;
}

export const usePlansStore = create<PlansState>((set, get) => ({
  plans: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
  search: "",
  hasFetched: false,
  organizationId: null,

  setOrganizationId: (orgId: number) => {
    set({ organizationId: orgId, hasFetched: false });
  },

  fetchPlans: async () => {
    const { page, organizationId, isLoading, search } = get();

    if (!organizationId) {
      console.warn("No organization ID set");
      return;
    }

    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const response = await plansService.getAll(organizationId, page, 10);
      const pagination = response.pagination;

      // Client-side search filtering
      let filteredPlans = response.data;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPlans = response.data.filter(
          (plan) =>
            plan.name.toLowerCase().includes(searchLower) ||
            plan.slug.toLowerCase().includes(searchLower)
        );
      }

      set({
        plans: filteredPlans,
        totalPages: pagination
          ? Math.ceil(pagination.total / pagination.limit)
          : 1,
        hasFetched: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch plans",
        isLoading: false,
      });
      toast.error("Failed to fetch plans");
    }
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchPlans();
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchPlans();
  },

  addPlan: async (data) => {
    const { organizationId } = get();
    if (!organizationId) {
      toast.error("No organization selected");
      return false;
    }

    try {
      await plansService.create(organizationId, data);
      toast.success("Plan created successfully");
      get().fetchPlans();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create plan");
      return false;
    }
  },

  updatePlan: async (planId, data) => {
    try {
      await plansService.update(planId, data);
      toast.success("Plan updated successfully");
      get().fetchPlans();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update plan");
      return false;
    }
  },

  removePlan: async (planId) => {
    try {
      await plansService.delete(planId);
      toast.success("Plan deleted successfully");
      get().fetchPlans();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete plan");
      return false;
    }
  },
}));
