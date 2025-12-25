import { useState, useCallback } from "react";
import { useDataStore } from "@/store/data.store";
import { toast } from "sonner";
import type { Feature } from "@/types";
import { featuresService } from "@/services";

import { useShallow } from "zustand/react/shallow";

export function useFeatures() {
  const {
    features,
    loading,
    fetchFeatures,
    addFeature,
    updateFeature,
    deleteFeature,
  } = useDataStore(
    useShallow((state) => ({
      features: state.features,
      loading: state.loading.features,
      fetchFeatures: state.fetchFeatures,
      addFeature: state.addFeature,
      updateFeature: state.updateFeature,
      deleteFeature: state.deleteFeature,
    }))
  );

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createFeature = useCallback(
    async (data: Partial<Feature>) => {
      try {
        setIsCreating(true);
        const response = await featuresService.create({
          name: data.name!,
          slug: data.slug!,
          description: data.description,
        });
        addFeature(response.data);
        toast.success("Feature created successfully");
        return true;
      } catch (error) {
        toast.error("Failed to create feature");
        console.error(error);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [addFeature]
  );

  const editFeature = useCallback(
    async (id: number, data: Partial<Feature>) => {
      try {
        setIsUpdating(true);
        const response = await featuresService.update(id, data);
        updateFeature(id, response.data);
        toast.success("Feature updated successfully");
        return true;
      } catch (error) {
        toast.error("Failed to update feature");
        console.error(error);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [updateFeature]
  );

  const removeFeature = useCallback(
    async (id: number) => {
      try {
        setIsDeleting(true);
        await featuresService.delete(id);
        deleteFeature(id);
        toast.success("Feature deleted successfully");
        return true;
      } catch (error) {
        toast.error("Failed to delete feature");
        console.error(error);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteFeature]
  );

  return {
    features,
    isLoading: loading,
    isCreating,
    isUpdating,
    isDeleting,
    fetchFeatures,
    createFeature,
    editFeature,
    removeFeature,
  };
}
