import { useState, useEffect, useCallback } from "react";
import { usageService, type UsageRecord } from "@/services/usage.service";
import { toast } from "sonner";

interface UseUsageOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in ms
}

export function useUsage(
  userId: number | null,
  featureSlug: string | null,
  options: UseUsageOptions = {}
) {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  const [usage, setUsage] = useState<UsageRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    if (!userId || !featureSlug) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await usageService.getUsage(userId, featureSlug);
      setUsage(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch usage");
    } finally {
      setIsLoading(false);
    }
  }, [userId, featureSlug]);

  const recordUsage = useCallback(
    async (amount: number = 1) => {
      if (!userId || !featureSlug) return;

      try {
        const response = await usageService.recordUsage(
          userId,
          featureSlug,
          amount
        );
        setUsage(response.data);
        return response.data;
      } catch (err: any) {
        toast.error(err.message || "Failed to record usage");
        throw err;
      }
    },
    [userId, featureSlug]
  );

  const resetUsage = useCallback(async () => {
    if (!userId || !featureSlug) return;

    try {
      await usageService.resetUsage(userId, featureSlug);
      setUsage((prev) => (prev ? { ...prev, currentUsage: 0 } : null));
      toast.success("Usage reset successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset usage");
      throw err;
    }
  }, [userId, featureSlug]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchUsage, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchUsage]);

  return {
    usage,
    isLoading,
    error,
    refresh: fetchUsage,
    recordUsage,
    resetUsage,
  };
}
