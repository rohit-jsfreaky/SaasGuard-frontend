import api from './api.client';
import type { Role } from '@/types/entities';

export const rolesService = {
  getAll: (limit = 50, offset = 0) => 
    api.get<Role[]>('/admin/roles', { params: { limit, offset } }),
  
  getById: (id: string) => 
    api.get<Role>(`/admin/roles/${id}`),
  
  create: (data: Partial<Role>) => 
    api.post<Role>('/admin/roles', data),
  
  update: (id: string, data: Partial<Role>) => 
    api.put<Role>(`/admin/roles/${id}`, data),
  
  delete: (id: string) => 
    api.delete<void>(`/admin/roles/${id}`),
};
