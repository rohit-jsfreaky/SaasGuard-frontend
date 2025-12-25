/**
 * UI Store
 * Zustand store for UI state management
 */

import { create } from "zustand";
import { getStorageItem, setStorageItem, StorageKeys } from "@/utils/storage";

/**
 * Theme type
 */
type Theme = "light" | "dark" | "system";

/**
 * Notification type
 */
export type NotificationType = "success" | "error" | "info" | "warning";

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // ms, 0 for no auto-dismiss
  createdAt: number;
}

/**
 * Default notification duration (ms)
 */
const DEFAULT_NOTIFICATION_DURATION = 5000;

/**
 * Generate unique notification ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * UI state interface
 */
interface UIState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Organization
  selectedOrganizationId: number | null;
  setSelectedOrganization: (orgId: number | null) => void;

  // Modals
  modalState: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;

  // Notifications
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Convenience notification methods
  showSuccess: (title: string, message?: string) => string;
  showError: (title: string, message?: string) => string;
  showInfo: (title: string, message?: string) => string;
  showWarning: (title: string, message?: string) => string;

  // Loading states
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Mobile
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

/**
 * Get initial theme from storage or system preference
 */
function getInitialTheme(): Theme {
  const stored = getStorageItem<Theme>(StorageKeys.THEME);
  if (stored) return stored;

  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "dark"; // Default to dark for admin dashboard
}

/**
 * Apply theme to document
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", isDark);
  setStorageItem(StorageKeys.THEME, theme);
}

/**
 * UI store
 */
export const useUIStore = create<UIState>((set, get) => ({
  // Theme
  theme: getInitialTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },

  // Sidebar
  sidebarOpen: true,
  sidebarCollapsed:
    getStorageItem<boolean>(StorageKeys.SIDEBAR_COLLAPSED) ?? false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => {
    setStorageItem(StorageKeys.SIDEBAR_COLLAPSED, collapsed);
    set({ sidebarCollapsed: collapsed });
  },

  // Navigation
  activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: "" }),

  // Organization
  selectedOrganizationId: null,
  setSelectedOrganization: (orgId) => set({ selectedOrganizationId: orgId }),

  // Modals
  modalState: {},
  openModal: (modalId) =>
    set((state) => ({
      modalState: { ...state.modalState, [modalId]: true },
    })),
  closeModal: (modalId) =>
    set((state) => ({
      modalState: { ...state.modalState, [modalId]: false },
    })),
  toggleModal: (modalId) =>
    set((state) => ({
      modalState: {
        ...state.modalState,
        [modalId]: !state.modalState[modalId],
      },
    })),
  isModalOpen: (modalId) => get().modalState[modalId] ?? false,

  // Notifications
  notifications: [],
  addNotification: (notification) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: Date.now(),
      duration: notification.duration ?? DEFAULT_NOTIFICATION_DURATION,
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-dismiss after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),

  // Convenience methods
  showSuccess: (title, message) =>
    get().addNotification({ type: "success", title, message }),
  showError: (title, message) =>
    get().addNotification({ type: "error", title, message, duration: 8000 }),
  showInfo: (title, message) =>
    get().addNotification({ type: "info", title, message }),
  showWarning: (title, message) =>
    get().addNotification({ type: "warning", title, message, duration: 6000 }),

  // Loading
  isGlobalLoading: false,
  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

  // Mobile
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}));

// Initialize theme on load
if (typeof window !== "undefined") {
  applyTheme(getInitialTheme());
}

export default useUIStore;
