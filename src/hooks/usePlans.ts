import { useState, useCallback } from "react";
import { useDataStore } from "@/store/data.store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import type { Plan } from "@/types";
import { plansService } from "@/services";

export function usePlans() {
  const { plans, loading, fetchPlans, addPlan, updatePlan, deletePlan } =
    useDataStore(
      useShallow((state) => ({
        plans: state.plans,
        loading: state.loading.plans,
        fetchPlans: (orgId?: number) => state.fetchPlans(orgId),
        addPlan: state.addPlan,
        updatePlan: state.updatePlan,
        deletePlan: state.deletePlan,
      }))
    );

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createPlan = useCallback(
    async (data: Partial<Plan>) => {
      try {
        setIsCreating(true);
        const response = await plansService.create({
          name: data.name!,
          slug: data.slug!,
          description: data.description,
          price: data.price,
          billingCycle: data.billingCycle,
        });
        addPlan(response.data);
        toast.success("Plan created successfully");
        return true;
      } catch (error) {
        toast.error("Failed to create plan");
        console.error(error);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [addPlan]
  );

  const editPlan = useCallback(
    async (id: number, data: Partial<Plan>) => {
      try {
        setIsUpdating(true);
        const response = await plansService.update(id, data);
        updatePlan(id, response.data);
        toast.success("Plan updated successfully");
        return true;
      } catch (error) {
        toast.error("Failed to update plan");
        console.error(error);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [updatePlan]
  );

  const removePlan = useCallback(
    async (id: number) => {
      try {
        setIsDeleting(true);
        await plansService.delete(id);
        deletePlan(id);
        toast.success("Plan deleted successfully");
        return true;
      } catch (error) {
        toast.error("Failed to delete plan");
        console.error(error);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [deletePlan]
  );

  return {
    plans,
    isLoading: loading,
    isCreating,
    isUpdating,
    isDeleting,
    fetchPlans,
    createPlan,
    editPlan,
    removePlan,
  };
}
