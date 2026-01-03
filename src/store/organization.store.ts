import { create } from "zustand";
import { persist } from "zustand/middleware";
import { organizationsService } from "@/services/organizations.service";
import type { Organization } from "@/types/entities";
import { toast } from "sonner";

const STORAGE_KEY = "currentOrganizationId";

interface OrganizationState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;

  // Actions
  fetchOrganizations: () => Promise<void>;
  setCurrentOrganization: (org: Organization) => void;
  createOrganization: (name: string) => Promise<boolean>;
  getCurrentOrgId: () => number | null;
  deleteOrganization: (id: number) => Promise<boolean>;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      organizations: [],
      currentOrganization: null,
      isLoading: false,
      error: null,
      hasFetched: false,

      fetchOrganizations: async () => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const response = await organizationsService.getAll();
          const orgs = response.data;

          // Get current org from localStorage or use first one
          const storedOrgId = localStorage.getItem(STORAGE_KEY);
          let currentOrg: Organization | null = null;

          if (storedOrgId) {
            currentOrg = orgs.find((o) => o.id === Number(storedOrgId)) || null;
          }

          // If no stored org or stored org not found, use first one
          if (!currentOrg && orgs.length > 0) {
            currentOrg = orgs[0];
            localStorage.setItem(STORAGE_KEY, String(currentOrg.id));
          }

          set({
            organizations: orgs,
            currentOrganization: currentOrg,
            hasFetched: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: err.message || "Failed to fetch organizations",
            isLoading: false,
            hasFetched: true,
          });
        }
      },

      setCurrentOrganization: (org: Organization) => {
        localStorage.setItem(STORAGE_KEY, String(org.id));
        set({ currentOrganization: org });

        // Reload page to refresh all data with new org context
        window.location.reload();
      },

      createOrganization: async (name: string) => {
        try {
          const response = await organizationsService.create(name);
          const newOrg = response.data;

          set((state) => ({
            organizations: [...state.organizations, newOrg],
          }));

          // Set as current org
          localStorage.setItem(STORAGE_KEY, String(newOrg.id));
          set({ currentOrganization: newOrg });

          toast.success("Organization created successfully");
          return true;
        } catch (err: any) {
          toast.error(err.message || "Failed to create organization");
          return false;
        }
      },

      deleteOrganization: async (id: number) => {
        const { organizations, currentOrganization } = get();

        try {
          const response = await organizationsService.delete(id);

          const remainingOrgs = organizations.filter((org) => org.id !== id);
          const nextOrg =
            currentOrganization?.id === id
              ? remainingOrgs[0] ?? null
              : currentOrganization;

          set({
            organizations: remainingOrgs,
            currentOrganization: nextOrg,
          });

          if (nextOrg) {
            localStorage.setItem(STORAGE_KEY, String(nextOrg.id));
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }

          toast.success(response.data?.message || "Organization deleted successfully");
          if (currentOrganization?.id === id) {
            window.location.reload();
          }

          return true;
        } catch (err: any) {
          const apiMessage = err?.response?.data?.error?.message;
          toast.error(apiMessage || err.message || "Failed to delete organization");
          return false;
        }
      },

      getCurrentOrgId: () => {
        const { currentOrganization } = get();
        return currentOrganization?.id || null;
      },
    }),
    {
      name: "organization-storage",
      partialize: (state) => ({
        currentOrganization: state.currentOrganization,
      }),
    }
  )
);
