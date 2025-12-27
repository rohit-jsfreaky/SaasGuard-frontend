import { create } from "zustand";
import { featuresService } from "@/services/features.service";
import type { Feature } from "@/types/entities";
import { toast } from "sonner";

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

    // Prevent duplicate fetches
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const response = await featuresService.getAll(page, 10, search);
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
      set({
        error: err.message || "Failed to fetch features",
        isLoading: false,
      });
      toast.error("Failed to fetch features");
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
