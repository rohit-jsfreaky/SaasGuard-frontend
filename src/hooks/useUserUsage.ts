import { useState, useEffect, useCallback } from "react";
import { usageService, type UsageRecord } from "@/services/usage.service";
import { toast } from "sonner";

export function useUserUsage(userId: number | null) {
  const [usageList, setUsageList] = useState<UsageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUsage = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await usageService.getUserUsage(userId);
      setUsageList(response.data);
      setHasFetched(true);
    } catch (err: any) {
      setError(err.message || "Failed to fetch usage");
      setHasFetched(true);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const resetUsage = useCallback(
    async (featureSlug: string) => {
      if (!userId) return;

      try {
        await usageService.resetUsage(userId, featureSlug);
        // Update local state
        setUsageList((prev) =>
          prev.map((item) =>
            item.featureSlug === featureSlug
              ? { ...item, currentUsage: 0 }
              : item
          )
        );
        toast.success("Usage reset successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to reset usage");
      }
    },
    [userId]
  );

  useEffect(() => {
    if (userId && !hasFetched && !isLoading) {
      fetchUsage();
    }
  }, [userId, hasFetched, isLoading, fetchUsage]);

  return {
    usageList,
    isLoading,
    error,
    hasFetched,
    refresh: fetchUsage,
    resetUsage,
  };
}
