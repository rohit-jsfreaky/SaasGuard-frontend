/**
 * Get value from localStorage
 * @param key - The key to retrieve
 */
export function getFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting key "${key}" from localStorage:`, error);
    return null;
  }
}

/**
 * Set value in localStorage
 * @param key - The key to set
 * @param value - The value to set (will be JSON stringified)
 */
export function setToStorage(key: string, value: any): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting key "${key}" to localStorage:`, error);
  }
}

/**
 * Remove value from localStorage
 * @param key - The key to remove
 */
export function removeFromStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
  }
}

/**
 * Clear all localStorage
 */
export function clearStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * Storage keys
 */
export const StorageKeys = {
  THEME: "saasguard-theme",
  SIDEBAR_COLLAPSED: "saasguard-sidebar-collapsed",
  AUTH_TOKEN: "saasguard-auth-token",
  USER: "saasguard-user",
};
