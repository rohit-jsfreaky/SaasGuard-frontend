import { useEffect } from "react";
import { useFeaturesStore } from "@/store/features.store";

export const useFeatures = () => {
  const store = useFeaturesStore();

  // Only fetch on first mount if not already fetched
  useEffect(() => {
    if (!store.hasFetched && !store.isLoading) {
      store.fetchFeatures();
    }
  }, []);

  return store;
};
