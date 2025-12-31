import { create } from "zustand";
import type { Role } from "@/types/entities";

type ModalType = "create" | "edit" | "delete" | null;

interface RolesModalState {
  isOpen: boolean;
  type: ModalType;
  data: Role | null;
  openModal: (type: ModalType, data?: Role) => void;
  closeModal: () => void;
}

export const useRolesModalStore = create<RolesModalState>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  openModal: (type, data = undefined) =>
    set({ isOpen: true, type, data: data || null }),
  closeModal: () => set({ isOpen: false, type: null, data: null }),
}));
