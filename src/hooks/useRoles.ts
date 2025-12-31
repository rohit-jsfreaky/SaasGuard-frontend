import { useEffect } from "react";
import { useRolesStore } from "@/store/roles.store";
import { useOrganizationStore } from "@/store/organization.store";

export const useRoles = () => {
  const store = useRolesStore();
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

  // Fetch roles when organization is set and not yet fetched
  useEffect(() => {
    if (store.organizationId && !store.hasFetched && !store.isLoading) {
      store.fetchRoles();
    }
  }, [store.organizationId, store.hasFetched, store.isLoading]);

  return store;
};
