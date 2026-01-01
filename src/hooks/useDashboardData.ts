import { useState, useEffect, useCallback } from "react";
import {
  dashboardService,
  type DashboardData,
} from "@/services/dashboard.service";
import { useOrganizationStore } from "@/store/organization.store";

export function useDashboardData() {
  const { currentOrganization } = useOrganizationStore();
  const organizationId = currentOrganization?.id;

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = useCallback(async () => {
    if (!organizationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await dashboardService.getOverview(organizationId);
      setData(response.data);
      setHasFetched(true);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
      setHasFetched(true);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    if (organizationId && !hasFetched && !isLoading) {
      fetchData();
    }
  }, [organizationId, hasFetched, isLoading, fetchData]);

  // Reset when organization changes
  useEffect(() => {
    setHasFetched(false);
    setData(null);
  }, [organizationId]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
    organizationId,
  };
}
