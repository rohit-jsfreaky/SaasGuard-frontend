import api from './api.client';
import type { Feature } from '@/types/entities';

export const featuresService = {
  getAll: (page = 1, limit = 10, search?: string) => {
    const offset = (page - 1) * limit;
    const params: any = { limit, offset };
    if (search) params.search = search;
    return api.get<Feature[]>('/admin/features', { params });
  },
  
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
