/**
 * Application constants
 */

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// API timeouts (in milliseconds)
export const API_TIMEOUT = 30000;

// Cache TTL (in milliseconds)
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "Session expired. Please login again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "Resource not found.",
  RATE_LIMITED: "Too many requests. Please wait a moment.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION: "Please check your input and try again.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: "Created successfully",
  UPDATED: "Updated successfully",
  DELETED: "Deleted successfully",
  SAVED: "Saved successfully",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "saas-guard-theme",
  ORGANIZATION: "currentOrganizationId",
  SIDEBAR_COLLAPSED: "sidebar-collapsed",
} as const;

// Override types
export const OVERRIDE_TYPES = {
  FEATURE_ENABLE: "feature_enable",
  FEATURE_DISABLE: "feature_disable",
  LIMIT_INCREASE: "limit_increase",
} as const;

// Override type labels
export const OVERRIDE_TYPE_LABELS: Record<string, string> = {
  feature_enable: "Enable Feature",
  feature_disable: "Disable Feature",
  limit_increase: "Increase Limit",
};

// Status colors (Tailwind classes)
export const STATUS_COLORS = {
  success:
    "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
  warning:
    "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30",
  error: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
  info: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
} as const;
