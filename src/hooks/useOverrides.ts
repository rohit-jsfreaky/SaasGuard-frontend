import { useEffect } from "react";
import { useOverridesStore } from "@/store/overrides.store";
import { useOrganizationStore } from "@/store/organization.store";

export const useOverrides = () => {
  const store = useOverridesStore();
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

  // Fetch overrides when organization is set and not yet fetched
  useEffect(() => {
    if (store.organizationId && !store.hasFetched && !store.isLoading) {
      store.fetchOverrides();
    }
  }, [store.organizationId, store.hasFetched, store.isLoading]);

  return store;
};
