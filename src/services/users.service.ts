import api from './api.client';
import type { User } from '@/types/entities';

export const usersService = {
  sync: (clerkId: string, email: string, organizationId?: number) =>
    api.post<User>('/users/sync', { clerkId, email, organizationId }),
  
  getCurrent: () =>
    api.get<User>('/users/me'),
  
  getById: (userId: number) =>
    api.get<User>(`/users/${userId}`),
  
  getByOrganization: (orgId: number, limit = 50, offset = 0) =>
    api.get<User[]>(`/organizations/${orgId}/users`, {
      params: { limit, offset }
    }),
  
  update: (userId: number, updates: { email?: string }) =>
    api.put<User>(`/users/${userId}`, updates),
  
  delete: (userId: number) =>
    api.delete<void>(`/users/${userId}`)
};
