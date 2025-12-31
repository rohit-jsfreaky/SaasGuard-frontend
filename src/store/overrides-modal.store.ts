import { create } from "zustand";
import type { Override } from "@/types/entities";

type ModalType = "create-user" | "create-org" | "edit" | "delete" | null;

interface OverridesModalState {
  isOpen: boolean;
  type: ModalType;
  data: Override | null;
  openModal: (type: ModalType, data?: Override) => void;
  closeModal: () => void;
}

export const useOverridesModalStore = create<OverridesModalState>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  openModal: (type, data = undefined) =>
    set({ isOpen: true, type, data: data || null }),
  closeModal: () => set({ isOpen: false, type: null, data: null }),
}));
