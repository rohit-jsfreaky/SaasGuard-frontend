import { create } from 'zustand';
import type { Feature } from '@/types/entities';

type ModalType = 'create' | 'edit' | 'delete' | null;

interface FeaturesModalState {
  isOpen: boolean;
  type: ModalType;
  data: Feature | null;
  openModal: (type: ModalType, data?: Feature) => void;
  closeModal: () => void;
}

export const useFeaturesModalStore = create<FeaturesModalState>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  openModal: (type, data = undefined) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: null }),
}));
