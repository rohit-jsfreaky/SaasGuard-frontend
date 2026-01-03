import { create } from "zustand";
import { usersService, type UserPermissions } from "@/services/users.service";
import type { User, Plan, Role, Override } from "@/types/entities";
import { toast } from "sonner";

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  organizationId: number | null;
  page: number;
  pageSize: number;
  totalUsers: number;
  search: string;

  // Actions
  setOrganizationId: (orgId: number) => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  fetchUsers: () => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  hasFetched: false,
  organizationId: null,
  page: 1,
  pageSize: 20,
  totalUsers: 0,
  search: "",

  setOrganizationId: (orgId: number) => {
    set({ organizationId: orgId, hasFetched: false, page: 1 });
  },

  setPage: (page: number) => {
    set({ page, hasFetched: false });
    get().fetchUsers();
  },

  setSearch: (search: string) => {
    set({ search, page: 1, hasFetched: false });
    get().fetchUsers();
  },

  fetchUsers: async () => {
    const { organizationId, isLoading, page, pageSize, search } = get();

    if (!organizationId) {
      console.warn("No organization ID set");
      return;
    }

    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const offset = (page - 1) * pageSize;
      const response = await usersService.getByOrganization(
        organizationId,
        pageSize,
        offset
      );

      let filteredUsers = response.data;

      // Client-side search filtering
      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = response.data.filter(
          (user) =>
            user.email.toLowerCase().includes(searchLower) ||
            user.firstName?.toLowerCase().includes(searchLower) ||
            user.lastName?.toLowerCase().includes(searchLower)
        );
      }

      set({
        users: filteredUsers,
        hasFetched: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch users",
        isLoading: false,
        hasFetched: true,
        users: [],
      });
      toast.error("Failed to fetch users");
    }
  },
}));

// User Detail Store
interface UserDetailState {
  user: User | null;
  plan: Plan | null;
  roles: Role[];
  permissions: UserPermissions | null;
  overrides: Override[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserDetail: (userId: number, organizationId: number) => Promise<void>;
  fetchUserPlan: (userId: number, organizationId: number) => Promise<void>;
  fetchUserRoles: (userId: number, organizationId: number) => Promise<void>;
  fetchUserPermissions: (
    userId: number,
    organizationId: number
  ) => Promise<void>;
  fetchUserOverrides: (userId: number) => Promise<void>;
  assignPlan: (
    userId: number,
    planId: number,
    organizationId: number
  ) => Promise<boolean>;
  removePlan: (userId: number, organizationId: number) => Promise<boolean>;
  assignRole: (
    userId: number,
    roleId: number,
    organizationId: number
  ) => Promise<boolean>;
  removeRole: (
    userId: number,
    roleId: number,
    organizationId: number
  ) => Promise<boolean>;
  reset: () => void;
}

export const useUserDetailStore = create<UserDetailState>((set, get) => ({
  user: null,
  plan: null,
  roles: [],
  permissions: null,
  overrides: [],
  isLoading: false,
  error: null,

  reset: () => {
    set({
      user: null,
      plan: null,
      roles: [],
      permissions: null,
      overrides: [],
      isLoading: false,
      error: null,
    });
  },

  fetchUserDetail: async (userId: number, organizationId: number) => {
    set({ isLoading: true, error: null });

    try {
      const [userRes, planRes, rolesRes] = await Promise.all([
        usersService.getById(userId),
        usersService.getUserPlan(userId, organizationId),
        usersService.getUserRoles(userId, organizationId),
      ]);

      set({
        user: userRes.data,
        plan: planRes.data,
        roles: rolesRes.data,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch user details",
        isLoading: false,
      });
      toast.error("Failed to fetch user details");
    }
  },

  fetchUserPlan: async (userId: number, organizationId: number) => {
    try {
      const response = await usersService.getUserPlan(userId, organizationId);
      set({ plan: response.data });
    } catch (err: any) {
      console.error("Failed to fetch user plan", err);
    }
  },

  fetchUserRoles: async (userId: number, organizationId: number) => {
    try {
      const response = await usersService.getUserRoles(userId, organizationId);
      set({ roles: response.data });
    } catch (err: any) {
      console.error("Failed to fetch user roles", err);
    }
  },

  fetchUserPermissions: async (userId: number, organizationId: number) => {
    try {
      const { plan } = get();
      const response = await usersService.getUserPermissions(
        userId,
        organizationId,
        plan?.id ?? null
      );
      set({ permissions: response.data });
    } catch (err: any) {
      console.error("Failed to fetch user permissions", err);
    }
  },

  fetchUserOverrides: async (userId: number) => {
    try {
      const response = await usersService.getUserOverrides(userId);
      set({ overrides: response.data });
    } catch (err: any) {
      console.error("Failed to fetch user overrides", err);
    }
  },

  assignPlan: async (
    userId: number,
    planId: number,
    organizationId: number
  ) => {
    try {
      await usersService.assignPlan(userId, planId, organizationId);
      toast.success("Plan assigned successfully");
      get().fetchUserPlan(userId, organizationId);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to assign plan");
      return false;
    }
  },

  removePlan: async (userId: number, organizationId: number) => {
    try {
      await usersService.removePlan(userId, organizationId);
      toast.success("Plan removed successfully");
      set({ plan: null });
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to remove plan");
      return false;
    }
  },

  assignRole: async (
    userId: number,
    roleId: number,
    organizationId: number
  ) => {
    try {
      await usersService.assignRole(userId, roleId, organizationId);
      toast.success("Role assigned successfully");
      get().fetchUserRoles(userId, organizationId);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to assign role");
      return false;
    }
  },

  removeRole: async (
    userId: number,
    roleId: number,
    organizationId: number
  ) => {
    try {
      await usersService.removeRole(userId, roleId, organizationId);
      toast.success("Role removed successfully");
      get().fetchUserRoles(userId, organizationId);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to remove role");
      return false;
    }
  },
}));
