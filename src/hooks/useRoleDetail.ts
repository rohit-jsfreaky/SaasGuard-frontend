import { useState, useCallback, useEffect } from "react";
import type { RoleWithPermissions } from "@/types";
import { rolesService } from "@/services";
import { toast } from "sonner";

interface UseRoleDetailReturn {
  role: RoleWithPermissions | null;
  users: { userId: number; email: string }[];
  isLoading: boolean;
  error: string | null;
  activeTab: "permissions" | "users";
  setActiveTab: (tab: "permissions" | "users") => void;
  refresh: () => Promise<void>;
  addPermission: (featureId: number, enabled?: boolean) => Promise<boolean>;
  removePermission: (featureId: number) => Promise<boolean>;
}

export function useRoleDetail(roleId: number | null): UseRoleDetailReturn {
  const [role, setRole] = useState<RoleWithPermissions | null>(null);
  const [users, setUsers] = useState<{ userId: number; email: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"permissions" | "users">(
    "permissions"
  );

  const fetchRoleDetails = useCallback(async () => {
    if (!roleId) return;

    setIsLoading(true);
    setError(null);
    try {
      const roleRes = await rolesService.getWithPermissions(roleId);
      setRole(roleRes.data);

      if (activeTab === "users") {
        const usersRes = await rolesService.getUsers(roleId);
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load role details");
      toast.error("Failed to load role details");
    } finally {
      setIsLoading(false);
    }
  }, [roleId, activeTab]);

  useEffect(() => {
    fetchRoleDetails();
  }, [fetchRoleDetails]);

  const addPermission = async (featureId: number, enabled = true) => {
    if (!roleId) return false;
    try {
      await rolesService.addPermission(roleId, featureId, enabled);
      await fetchRoleDetails();
      toast.success("Permission added to role");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to add permission");
      return false;
    }
  };

  const removePermission = async (featureId: number) => {
    if (!roleId) return false;
    try {
      await rolesService.removePermission(roleId, featureId);
      await fetchRoleDetails();
      toast.success("Permission removed from role");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove permission");
      return false;
    }
  };

  return {
    role,
    users,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    refresh: fetchRoleDetails,
    addPermission,
    removePermission,
  };
}
