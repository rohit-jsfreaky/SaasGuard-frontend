import api from "./api.client";
import type { Organization } from "@/types/entities";

// Types for admin management
export interface OrgAdmin {
  id: number;
  clerkId: string;
  email: string;
  isCreator: boolean;
  hasAdminRole: boolean;
  createdAt: string;
}

export interface OrgMember {
  id: number;
  clerkId: string;
  email: string;
  organizationId: number;
  isAdmin: boolean;
  isCreator: boolean;
  createdAt: string;
}

interface AdminsResponse {
  admins: OrgAdmin[];
  total: number;
}

export const settingsService = {
  // Update organization settings (name)
  updateOrganization: (orgId: number, data: { name: string }) =>
    api.put<Organization>(`/organizations/${orgId}`, data),

  // Get organization admins
  getAdmins: (orgId: number) =>
    api.get<AdminsResponse>(`/admin/organizations/${orgId}/admins`),

  // Make user an admin
  makeAdmin: (orgId: number, userId: number) =>
    api.post<{ userId: number; email: string; isAdmin: boolean }>(
      `/admin/organizations/${orgId}/admins/${userId}`
    ),

  // Remove admin privileges
  removeAdmin: (orgId: number, userId: number) =>
    api.delete<{ userId: number; email: string; isAdmin: boolean }>(
      `/admin/organizations/${orgId}/admins/${userId}`
    ),

  // Get all members with admin status (for adding new admins)
  getMembers: (orgId: number, limit = 50, offset = 0) =>
    api.get<OrgMember[]>(`/admin/organizations/${orgId}/members`, {
      params: { limit, offset },
    }),
};
