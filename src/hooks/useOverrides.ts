import { useState, useCallback } from "react";
import { useDataStore } from "@/store/data.store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { overridesService } from "@/services";
import type {
  CreateOverrideInput,
  UpdateOverrideInput,
} from "@/services/overrides.service";

export function useOverrides() {
  const {
    overrides,
    loading,
    fetchOverrides, // Generic fetch from store
    addOverride,
    updateOverride,
    deleteOverride,
  } = useDataStore(
    useShallow((state) => ({
      overrides: state.overrides,
      loading: state.loading.overrides,
      fetchOverrides: state.fetchOverrides,
      addOverride: state.addOverride,
      updateOverride: state.updateOverride,
      deleteOverride: state.deleteOverride,
    }))
  );

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Custom fetch to support org/user specific lists if needed,
  // but store's fetchOverrides might be enough if we filter on client or update store.
  // For now, let's rely on store's fetchOverrides which uses `filters` state.
  // But we might need specific fetch methods here if we want to isolate lists.
  // Given the complexity, let's stick to the store's global list for "admin management"
  // but if we need precise lists (e.g. "User Overrides" tab vs "Org Overrides" tab),
  // we might want to fetch locally in the hook or separate store actions.
  // Implementation plan suggests using store. Let's filter on client side for tabs.

  const createOverride = useCallback(
    async (data: CreateOverrideInput) => {
      try {
        setIsCreating(true);
        const response = await overridesService.create(data);
        addOverride(response.data);
        toast.success("Override created successfully");
        return true;
      } catch (error) {
        toast.error("Failed to create override");
        console.error(error);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [addOverride]
  );

  const editOverride = useCallback(
    async (id: number, data: UpdateOverrideInput) => {
      try {
        setIsUpdating(true);
        const response = await overridesService.update(id, data);
        updateOverride(id, response.data);
        toast.success("Override updated successfully");
        return true;
      } catch (error) {
        toast.error("Failed to update override");
        console.error(error);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [updateOverride]
  );

  const removeOverride = useCallback(
    async (id: number) => {
      try {
        setIsDeleting(true);
        await overridesService.delete(id);
        deleteOverride(id);
        toast.success("Override deleted successfully");
        return true;
      } catch (error) {
        toast.error("Failed to delete override");
        console.error(error);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteOverride]
  );

  return {
    overrides,
    isLoading: loading,
    isCreating,
    isUpdating,
    isDeleting,
    fetchOverrides,
    createOverride,
    editOverride,
    removeOverride,
  };
}
