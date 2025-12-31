import { useEffect } from "react";
import { useUsersStore } from "@/store/users.store";
import { useOrganizationStore } from "@/store/organization.store";

export const useUsers = () => {
  const store = useUsersStore();
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

  // Fetch users when organization is set and not yet fetched
  useEffect(() => {
    if (store.organizationId && !store.hasFetched && !store.isLoading) {
      store.fetchUsers();
    }
  }, [store.organizationId, store.hasFetched, store.isLoading]);

  return {
    ...store,
    organizationId: currentOrganization?.id || null,
  };
};
