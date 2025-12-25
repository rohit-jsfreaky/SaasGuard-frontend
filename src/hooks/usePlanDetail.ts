import { useState, useCallback, useEffect } from "react";
import type { PlanWithFeatures, AdminUser } from "@/types";
import { plansService } from "@/services";
import { toast } from "sonner";

interface UsePlanDetailReturn {
  plan: PlanWithFeatures | null;
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  activeTab: "features" | "users";
  setActiveTab: (tab: "features" | "users") => void;
  refresh: () => Promise<void>;
  updateFeature: (
    featureId: number,
    enabled: boolean,
    limit?: number
  ) => Promise<boolean>;
  removeFeature: (featureId: number) => Promise<boolean>;
  addFeature: (
    featureId: number,
    enabled?: boolean,
    limit?: number
  ) => Promise<boolean>;
}

export function usePlanDetail(planId: number | null): UsePlanDetailReturn {
  const [plan, setPlan] = useState<PlanWithFeatures | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"features" | "users">("features");

  const fetchPlanDetails = useCallback(async () => {
    if (!planId) return;

    setIsLoading(true);
    setError(null);
    try {
      // Parallel fetch could be better but let's do sequential for error handling
      const planRes = await plansService.getWithFeatures(planId);
      setPlan(planRes.data);

      if (activeTab === "users") {
        const usersRes = await plansService.getUsers(planId);
        setUsers(usersRes.data.users);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load plan details");
      toast.error("Failed to load plan details");
    } finally {
      setIsLoading(false);
    }
  }, [planId, activeTab]);

  useEffect(() => {
    fetchPlanDetails();
  }, [fetchPlanDetails]);

  const updateFeature = async (
    featureId: number,
    enabled: boolean,
    limit?: number
  ) => {
    if (!planId) return false;
    try {
      await plansService.addFeature(planId, featureId, enabled, limit); // Re-adding updates it
      await fetchPlanDetails();
      toast.success("Feature configuration updated");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update feature");
      return false;
    }
  };

  const removeFeature = async (featureId: number) => {
    if (!planId) return false;
    try {
      await plansService.removeFeature(planId, featureId);
      await fetchPlanDetails();
      toast.success("Feature removed from plan");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove feature");
      return false;
    }
  };

  const addFeature = async (
    featureId: number,
    enabled = true,
    limit?: number
  ) => {
    if (!planId) return false;
    try {
      await plansService.addFeature(planId, featureId, enabled, limit);
      await fetchPlanDetails();
      toast.success("Feature added to plan");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to add feature");
      return false;
    }
  };

  return {
    plan,
    users,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    refresh: fetchPlanDetails,
    updateFeature,
    removeFeature,
    addFeature,
  };
}
