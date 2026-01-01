import { create } from "zustand";
import {
  settingsService,
  type OrgAdmin,
  type OrgMember,
} from "@/services/settings.service";
import { useOrganizationStore } from "./organization.store";
import { toast } from "sonner";

interface SettingsState {
  // Admin management
  admins: OrgAdmin[];
  members: OrgMember[];
  isLoadingAdmins: boolean;
  isLoadingMembers: boolean;
  error: string | null;
  hasFetchedAdmins: boolean;
  hasFetchedMembers: boolean;

  // Actions
  fetchAdmins: (orgId: number) => Promise<void>;
  fetchMembers: (orgId: number) => Promise<void>;
  makeAdmin: (orgId: number, userId: number) => Promise<boolean>;
  removeAdmin: (orgId: number, userId: number) => Promise<boolean>;
  updateOrgName: (orgId: number, name: string) => Promise<boolean>;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  admins: [],
  members: [],
  isLoadingAdmins: false,
  isLoadingMembers: false,
  error: null,
  hasFetchedAdmins: false,
  hasFetchedMembers: false,

  fetchAdmins: async (orgId: number) => {
    if (get().isLoadingAdmins) return;

    set({ isLoadingAdmins: true, error: null });

    try {
      const response = await settingsService.getAdmins(orgId);
      set({
        admins: response.data.admins,
        hasFetchedAdmins: true,
        isLoadingAdmins: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch admins",
        isLoadingAdmins: false,
        hasFetchedAdmins: true,
      });
      toast.error("Failed to fetch admins");
    }
  },

  fetchMembers: async (orgId: number) => {
    if (get().isLoadingMembers) return;

    set({ isLoadingMembers: true, error: null });

    try {
      const response = await settingsService.getMembers(orgId);
      set({
        members: response.data,
        hasFetchedMembers: true,
        isLoadingMembers: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch members",
        isLoadingMembers: false,
        hasFetchedMembers: true,
      });
      // Don't show toast for members - it might not be available
    }
  },

  makeAdmin: async (orgId: number, userId: number) => {
    try {
      await settingsService.makeAdmin(orgId, userId);
      toast.success("User is now an admin");
      // Refetch admins and members
      get().fetchAdmins(orgId);
      set({ hasFetchedMembers: false });
      get().fetchMembers(orgId);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to make user admin");
      return false;
    }
  },

  removeAdmin: async (orgId: number, userId: number) => {
    try {
      await settingsService.removeAdmin(orgId, userId);
      toast.success("Admin privileges removed");
      // Refetch admins and members
      get().fetchAdmins(orgId);
      set({ hasFetchedMembers: false });
      get().fetchMembers(orgId);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to remove admin");
      return false;
    }
  },

  updateOrgName: async (orgId: number, name: string) => {
    try {
      const response = await settingsService.updateOrganization(orgId, {
        name,
      });
      // Update the organization in the organization store
      const orgStore = useOrganizationStore.getState();
      if (orgStore.currentOrganization?.id === orgId) {
        useOrganizationStore.setState({
          currentOrganization: response.data,
          organizations: orgStore.organizations.map((org) =>
            org.id === orgId ? response.data : org
          ),
        });
      }
      toast.success("Organization name updated");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update organization");
      return false;
    }
  },

  reset: () => {
    set({
      admins: [],
      members: [],
      isLoadingAdmins: false,
      isLoadingMembers: false,
      error: null,
      hasFetchedAdmins: false,
      hasFetchedMembers: false,
    });
  },
}));
