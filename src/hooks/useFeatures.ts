import { useEffect } from "react";
import { useFeaturesStore } from "@/store/features.store";
import { useOrganizationStore } from "@/store/organization.store";

export const useFeatures = () => {
  const store = useFeaturesStore();
  const { currentOrganization } = useOrganizationStore();

  // Only fetch on first mount if not already fetched
  useEffect(() => {
    if (!currentOrganization) return;
    if (!store.hasFetched && !store.isLoading) {
      store.fetchFeatures();
    }
  }, [currentOrganization, store.hasFetched, store.isLoading]);

  return { ...store, currentOrganization };
};
