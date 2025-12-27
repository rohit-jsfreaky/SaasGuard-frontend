import api from './api.client';
import type { Plan } from '@/types/entities';

export const plansService = {
  getAll: (limit = 50, offset = 0) => 
    api.get<Plan[]>('/admin/plans', { params: { limit, offset } }),
  
  getById: (id: string) => 
    api.get<Plan>(`/admin/plans/${id}`),
  
  create: (data: Partial<Plan>) => 
    api.post<Plan>('/admin/plans', data),
  
  update: (id: string, data: Partial<Plan>) => 
    api.put<Plan>(`/admin/plans/${id}`, data),
  
  delete: (id: string) => 
    api.delete<void>(`/admin/plans/${id}`),
};
