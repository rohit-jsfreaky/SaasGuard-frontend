import api from './api.client';
import type { User } from '@/types/entities';

export const authService = {
  verify: () => 
    api.post<{ message: string; userId: string; user: any }>('/auth/verify'),
  
  getCurrentUser: () => 
    api.get<{ id: string; email: string; orgId: number }>('/auth/me'),
    
  getFullUser: () => 
    api.get<User>('/auth/me/full'),
};
