/**
 * Auth Store
 * Zustand store for authentication and user state
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Organization } from "@/types";

/**
 * Auth state interface
 */
interface AuthState {
  // State
  currentUser: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setOrganization: (org: Organization | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;

  // Selectors
  getUserId: () => number | null;
  getOrgId: () => number | null;
}

/**
 * Auth store with persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      organization: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // Actions
      setUser: (user) =>
        set({
          currentUser: user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),

      setOrganization: (org) =>
        set({
          organization: org,
        }),

      clearUser: () =>
        set({
          currentUser: null,
          organization: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      setError: (error) =>
        set({
          error,
          isLoading: false,
        }),

      logout: () => {
        set({
          currentUser: null,
          organization: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Selectors
      getUserId: () => get().currentUser?.userId ?? null,

      getOrgId: () => {
        const { organization, currentUser } = get();
        if (organization?.id) return organization.id;
        // Try to get from user's organizationId if it's a number
        const orgId = currentUser?.organizationId;
        if (orgId && typeof orgId === "string") {
          const parsed = parseInt(orgId, 10);
          return isNaN(parsed) ? null : parsed;
        }
        return null;
      },
    }),
    {
      name: "saasguard_auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        organization: state.organization,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
