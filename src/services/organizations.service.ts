import api from "./api.client";
import type { Organization } from "@/types/entities";

export const organizationsService = {
  // Get all organizations for the current user
  getAll: () => api.get<Organization[]>("/organizations"),

  // Get a specific organization
  getById: (id: number) => api.get<Organization>(`/organizations/${id}`),

  // Create a new organization
  create: (name: string) => api.post<Organization>("/organizations", { name }),

  // Delete an organization
  delete: (id: number) => api.delete<{ success: boolean; message: string }>(`/organizations/${id}`),
};
