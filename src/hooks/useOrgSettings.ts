/**
 * useOrgSettings Hook
 * Manage organization settings and admin management
 */

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { organizationsService } from "@/services/organizations.service";
import { useOrganization } from "@/hooks/useOrganization";
import type { AdminUser } from "@/types";

export function useOrgSettings() {
  const { orgId, organization, setOrganization } = useOrganization();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState({
    org: false,
    admins: false,
    update: false,
  });

  // Fetch admins
  const fetchAdmins = useCallback(async () => {
    if (!orgId) return;
    setLoading((prev) => ({ ...prev, admins: true }));
    try {
      const response = await organizationsService.getAdmins(orgId);
      setAdmins(response.data);
    } catch (error) {
      toast.error("Failed to fetch admins");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, admins: false }));
    }
  }, [orgId]);

  // Fetch organization
  const fetchOrganization = useCallback(async () => {
    if (!orgId) return;
    setLoading((prev) => ({ ...prev, org: true }));
    try {
      const response = await organizationsService.getById(orgId);
      setOrganization(response.data);
    } catch (error) {
      toast.error("Failed to fetch organization details");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, org: false }));
    }
  }, [orgId, setOrganization]);

  // Fetch Organization Effect
  useEffect(() => {
    if (orgId && !organization) {
      fetchOrganization();
    }
  }, [orgId, organization, fetchOrganization]);

  // Fetch Admins Effect - depends only on orgId
  useEffect(() => {
    if (orgId) {
      fetchAdmins();
    }
  }, [orgId, fetchAdmins]);

  // Update Organization
  const updateOrg = async (data: { name: string }) => {
    if (!orgId) return;
    setLoading((prev) => ({ ...prev, update: true }));
    try {
      const response = await organizationsService.update(orgId, data);
      setOrganization(response.data); // Update global context
      toast.success("Organization updated successfully");
    } catch (error) {
      toast.error("Failed to update organization");
      console.error(error);
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  // Add Admin
  const addAdmin = async (userId: number) => {
    if (!orgId) return;
    try {
      await organizationsService.addAdmin(orgId, userId);
      toast.success("Admin added successfully");
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to add admin");
      console.error(error);
      throw error;
    }
  };

  // Remove Admin
  const removeAdmin = async (userId: number) => {
    if (!orgId) return;
    try {
      await organizationsService.removeAdmin(orgId, userId);
      toast.success("Admin removed successfully");
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to remove admin");
      console.error(error);
      throw error;
    }
  };

  return {
    organization,
    admins,
    loading,
    updateOrg,
    addAdmin,
    removeAdmin,
    refreshAdmins: fetchAdmins,
  };
}
