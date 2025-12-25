/**
 * Authentication Types
 * Types for user authentication and session management
 */

/**
 * Authenticated user context
 */
export interface User {
  userId: number;
  clerkId: string;
  email: string;
  organizationId?: string;
  role?: string;
}

/**
 * Auth state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Organization context
 */
export interface Organization {
  id: number;
  name: string;
  slug: string;
  clerkOrgId?: string;
}
