import api from './api.client';
import type { Override } from '@/types/entities';

export const overridesService = {
  getAll: (limit = 50, offset = 0) => 
    api.get<Override[]>('/admin/overrides', { params: { limit, offset } }),
  
  getById: (id: string) => 
    api.get<Override>(`/admin/overrides/${id}`),
  
  create: (data: Partial<Override>) => 
    api.post<Override>('/admin/overrides', data),
  
  update: (id: string, data: Partial<Override>) => 
    api.put<Override>(`/admin/overrides/${id}`, data),
  
  delete: (id: string) => 
    api.delete<void>(`/admin/overrides/${id}`),
};
