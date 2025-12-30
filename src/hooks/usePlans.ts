import { useEffect } from "react";
import { usePlansStore } from "@/store/plans.store";
import { useOrganizationStore } from "@/store/organization.store";

export const usePlans = () => {
  const store = usePlansStore();
  const { currentOrganization } = useOrganizationStore();

  // Set organization ID when current org changes
  useEffect(() => {
    if (
      currentOrganization?.id &&
      store.organizationId !== currentOrganization.id
    ) {
      store.setOrganizationId(currentOrganization.id);
    }
  }, [currentOrganization?.id]);

  // Fetch plans when organization is set and not yet fetched
  useEffect(() => {
    if (store.organizationId && !store.hasFetched && !store.isLoading) {
      store.fetchPlans();
    }
  }, [store.organizationId, store.hasFetched, store.isLoading]);

  return store;
};
