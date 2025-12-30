import { create } from "zustand";
import type { Plan } from "@/types/entities";

type ModalType = "create" | "edit" | "delete" | null;

interface PlansModalState {
  isOpen: boolean;
  type: ModalType;
  data: Plan | null;
  openModal: (type: ModalType, data?: Plan) => void;
  closeModal: () => void;
}

export const usePlansModalStore = create<PlansModalState>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  openModal: (type, data = undefined) =>
    set({ isOpen: true, type, data: data || null }),
  closeModal: () => set({ isOpen: false, type: null, data: null }),
}));
