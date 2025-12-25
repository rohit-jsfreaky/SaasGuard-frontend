/**
 * useOrganization Hook
 * Access current organization context
 */

import { useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import type { Organization } from "@/types";

/**
 * Organization hook return type
 */
export interface UseOrganizationReturn {
  /** Current organization */
  organization: Organization | null;
  /** Organization ID for API calls */
  orgId: number | null;
  /** Whether organization is loaded */
  hasOrganization: boolean;
  /** Set current organization */
  setOrganization: (org: Organization | null) => void;
}

/**
 * Hook to access current organization
 */
export function useOrganization(): UseOrganizationReturn {
  const organization = useAuthStore((state) => state.organization);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setOrganization = useAuthStore((state) => state.setOrganization);

  const orgId = useMemo(() => {
    if (organization?.id) return organization.id;
    // Fall back to user's organizationId
    const userOrgId = currentUser?.organizationId;
    if (userOrgId && typeof userOrgId === "string") {
      const parsed = parseInt(userOrgId, 10);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  }, [organization, currentUser]);

  return {
    organization,
    orgId,
    hasOrganization: orgId !== null,
    setOrganization,
  };
}

export default useOrganization;
