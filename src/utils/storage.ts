/**
 * Local Storage Utilities
 * Safe wrappers for browser storage
 */

const PREFIX = "saasguard_";

/**
 * Get item from localStorage with type safety
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(`${PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch {
    console.error(`Error reading from localStorage: ${key}`);
    return null;
  }
}

/**
 * Set item in localStorage
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch {
    console.error(`Error writing to localStorage: ${key}`);
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(`${PREFIX}${key}`);
  } catch {
    console.error(`Error removing from localStorage: ${key}`);
  }
}

/**
 * Clear all SaaS Guard items from localStorage
 */
export function clearStorage(): void {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    console.error("Error clearing localStorage");
  }
}

/**
 * Storage keys enum
 */
export const StorageKeys = {
  THEME: "theme",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
  LAST_ORGANIZATION: "last_organization",
} as const;
