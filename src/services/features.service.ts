import api from './api.client';
import type { Feature } from '@/types/entities';

export const featuresService = {
  getAll: (limit = 50, offset = 0) => 
    api.get<Feature[]>('/admin/features', { params: { limit, offset } }),
  
  getById: (id: string) => 
    api.get<Feature>(`/admin/features/${id}`),
  
  create: (data: Partial<Feature>) => 
    api.post<Feature>('/admin/features', data),
  
  update: (id: string, data: Partial<Feature>) => 
    api.put<Feature>(`/admin/features/${id}`, data),
  
  delete: (id: string) => 
    api.delete<void>(`/admin/features/${id}`),
  
  search: (query: string) => 
    api.get<Feature[]>('/admin/features/search', { params: { q: query } })
};
