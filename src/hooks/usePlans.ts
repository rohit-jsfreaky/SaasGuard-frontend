import { useEffect } from "react";
import { usePlansStore } from "@/store/plans.store";
import { useAuth } from "./useAuth";

export const usePlans = () => {
  const store = usePlansStore();
  const { user } = useAuth();

  // Set organization ID when user is available
  useEffect(() => {
    if (user?.organizationId && store.organizationId !== user.organizationId) {
      store.setOrganizationId(user.organizationId);
    }
  }, [user?.organizationId]);

  // Fetch plans when organization is set and not yet fetched
  useEffect(() => {
    if (store.organizationId && !store.hasFetched && !store.isLoading) {
      store.fetchPlans();
    }
  }, [store.organizationId, store.hasFetched, store.isLoading]);

  return store;
};
