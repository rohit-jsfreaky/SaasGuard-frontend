import { create } from "zustand";
import { rolesService } from "@/services/roles.service";
import type { Role } from "@/types/entities";
import { toast } from "sonner";

interface RolesState {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  search: string;
  hasFetched: boolean;
  organizationId: number | null;

  // Actions
  setOrganizationId: (orgId: number) => void;
  fetchRoles: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  addRole: (data: {
    name: string;
    slug: string;
    description?: string;
  }) => Promise<boolean>;
  updateRole: (
    roleId: number,
    data: { name?: string; description?: string }
  ) => Promise<boolean>;
  removeRole: (roleId: number) => Promise<boolean>;
}

export const useRolesStore = create<RolesState>((set, get) => ({
  roles: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
  search: "",
  hasFetched: false,
  organizationId: null,

  setOrganizationId: (orgId: number) => {
    set({ organizationId: orgId, hasFetched: false });
  },

  fetchRoles: async () => {
    const { page, organizationId, isLoading, search } = get();

    if (!organizationId) {
      console.warn("No organization ID set");
      return;
    }

    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const response = await rolesService.getAll(organizationId, page, 50);
      const pagination = response.pagination;

      // Client-side search filtering
      let filteredRoles = response.data;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredRoles = response.data.filter(
          (role) =>
            role.name.toLowerCase().includes(searchLower) ||
            role.slug.toLowerCase().includes(searchLower)
        );
      }

      set({
        roles: filteredRoles,
        totalPages: pagination
          ? Math.ceil(pagination.total / pagination.limit)
          : 1,
        hasFetched: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch roles",
        isLoading: false,
      });
      toast.error("Failed to fetch roles");
    }
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchRoles();
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchRoles();
  },

  addRole: async (data) => {
    const { organizationId } = get();
    if (!organizationId) {
      toast.error("No organization selected");
      return false;
    }

    try {
      await rolesService.create(organizationId, data);
      toast.success("Role created successfully");
      get().fetchRoles();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create role");
      return false;
    }
  },

  updateRole: async (roleId, data) => {
    try {
      await rolesService.update(roleId, data);
      toast.success("Role updated successfully");
      get().fetchRoles();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
      return false;
    }
  },

  removeRole: async (roleId) => {
    try {
      await rolesService.delete(roleId);
      toast.success("Role deleted successfully");
      get().fetchRoles();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete role");
      return false;
    }
  },
}));
