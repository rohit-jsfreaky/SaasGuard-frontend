import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "@/services";
import type { DashboardData } from "@/services/dashboard.service";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "sonner";

interface UseDashboardDataReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useDashboardData(): UseDashboardDataReturn {
  const { orgId } = useOrganization();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!orgId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await dashboardService.getDashboard(orgId);
      setData(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to update dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    if (orgId) {
      fetchData();
    } else {
      // No organization selected, stop loading
      setIsLoading(false);
    }
  }, [orgId, fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
    lastUpdated,
  };
}
