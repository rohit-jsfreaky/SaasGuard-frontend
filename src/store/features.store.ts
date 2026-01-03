import { create } from "zustand";
import { featuresService } from "@/services/features.service";
import type { Feature } from "@/types/entities";
import { toast } from "sonner";
import { useOrganizationStore } from "@/store/organization.store";

interface FeaturesState {
  features: Feature[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  search: string;
  hasFetched: boolean;

  // Actions
  fetchFeatures: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  addFeature: (data: Partial<Feature>) => Promise<boolean>;
  updateFeature: (id: string, data: Partial<Feature>) => Promise<boolean>;
  removeFeature: (id: string) => Promise<boolean>;
}

export const useFeaturesStore = create<FeaturesState>((set, get) => ({
  features: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
  search: "",
  hasFetched: false,

  fetchFeatures: async () => {
    const { page, search, isLoading } = get();

    const orgId = useOrganizationStore.getState().getCurrentOrgId();

    if (!orgId) {
      set({ error: "Select or create an organization to view features." });
      return;
    }

    // Prevent duplicate fetches
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const response = await featuresService.getAll(page, 10, search, orgId);
      const pagination = response.pagination;

      set({
        features: response.data,
        totalPages: pagination
          ? Math.ceil(pagination.total / pagination.limit)
          : 1,
        hasFetched: true,
        isLoading: false,
      });
    } catch (err: any) {
      const apiMessage = err?.response?.data?.error?.message;
      const message = apiMessage || err.message || "Failed to fetch features";
      set({
        error: message,
        isLoading: false,
      });
      toast.error(message);
    }
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchFeatures();
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchFeatures();
  },

  addFeature: async (data: Partial<Feature>) => {
    try {
      await featuresService.create(data);
      toast.success("Feature created successfully");
      get().fetchFeatures();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create feature");
      return false;
    }
  },

  updateFeature: async (id: string, data: Partial<Feature>) => {
    try {
      await featuresService.update(id, data);
      toast.success("Feature updated successfully");
      get().fetchFeatures();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update feature");
      return false;
    }
  },

  removeFeature: async (id: string) => {
    try {
      await featuresService.delete(id);
      toast.success("Feature deleted successfully");
      get().fetchFeatures();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete feature");
      return false;
    }
  },
}));
