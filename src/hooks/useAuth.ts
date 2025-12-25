/**
 * useAuth Hook
 * Access authentication state and current user
 */

import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { useMemo } from "react";
import type { User } from "@/types";

/**
 * Auth hook return type
 */
export interface UseAuthReturn {
  /** Current authenticated user */
  user: User | null;
  /** Whether authentication is loading */
  isLoading: boolean;
  /** Whether user is signed in */
  isSignedIn: boolean;
  /** Sign out function */
  signOut: () => Promise<void>;
}

/**
 * Hook to access authentication state
 */
export function useAuth(): UseAuthReturn {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user: clerkUser, isLoaded: userLoaded } = useUser();

  const isLoading = !isLoaded || !userLoaded;

  const user = useMemo<User | null>(() => {
    if (!clerkUser || !isSignedIn) return null;

    return {
      userId: parseInt(clerkUser.id, 10) || 0, // Will be mapped from backend
      clerkId: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      organizationId: clerkUser.organizationMemberships?.[0]?.organization?.id,
      role: clerkUser.publicMetadata?.role as string | undefined,
    };
  }, [clerkUser, isSignedIn]);

  return {
    user,
    isLoading,
    isSignedIn: !!isSignedIn,
    signOut: async () => {
      await signOut();
    },
  };
}

export default useAuth;
