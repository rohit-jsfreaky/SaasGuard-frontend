import { useState, useCallback, useEffect } from "react";
import type { AdminUser, Role, Override, Usage } from "@/types";
import { usersService } from "@/services";
import { toast } from "sonner";

interface UseUserDetailReturn {
  user:
    | (AdminUser & { roles: Role[]; usage: Usage[]; overrides: Override[] })
    | null;
  permissions: {
    features: Record<string, boolean>;
    limits: Record<string, { max: number; used: number; remaining: number }>;
  } | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateUserPlan: (planId: number) => Promise<boolean>;
  assignRole: (roleId: number) => Promise<boolean>;
  removeRole: (roleId: number) => Promise<boolean>;
}

export function useUserDetail(userId: number | null): UseUserDetailReturn {
  const [user, setUser] = useState<UseUserDetailReturn["user"]>(null);
  const [permissions, setPermissions] =
    useState<UseUserDetailReturn["permissions"]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetail = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      // Parallel fetch for details and permissions
      const [detailRes, permRes] = await Promise.all([
        usersService.getWithDetails(userId),
        usersService.getPermissions(userId),
      ]);

      setUser(detailRes.data);
      setPermissions(permRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load user details");
      toast.error("Failed to load user details");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  const updateUserPlan = async (planId: number) => {
    if (!userId) return false;
    try {
      await usersService.update(userId, { planId });
      await fetchUserDetail();
      toast.success("User plan updated");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user plan");
      return false;
    }
  };

  const assignRole = async (roleId: number) => {
    if (!userId) return false;
    try {
      await usersService.assignRole(userId, roleId);
      await fetchUserDetail();
      toast.success("Role assigned to user");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign role");
      return false;
    }
  };

  const removeRole = async (roleId: number) => {
    if (!userId) return false;
    try {
      await usersService.removeRole(userId, roleId);
      await fetchUserDetail();
      toast.success("Role removed from user");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove role");
      return false;
    }
  };

  return {
    user,
    permissions,
    isLoading,
    error,
    refresh: fetchUserDetail,
    updateUserPlan,
    assignRole,
    removeRole,
  };
}
