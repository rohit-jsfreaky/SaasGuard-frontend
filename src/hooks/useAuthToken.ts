/**
 * useAuthToken Hook
 * Get Clerk session token for API requests
 */

import { useAuth } from "@clerk/clerk-react";
import { useCallback, useEffect, useState } from "react";

/**
 * Auth token hook return type
 */
export interface UseAuthTokenReturn {
  /** Current session token */
  token: string | null;
  /** Whether token is loading */
  isLoading: boolean;
  /** Get fresh token */
  getToken: () => Promise<string | null>;
}

/**
 * Hook to get authentication token for API requests
 */
export function useAuthToken(): UseAuthTokenReturn {
  const { getToken: getClerkToken, isLoaded } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get token function
  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      const freshToken = await getClerkToken();
      setToken(freshToken);
      return freshToken;
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return null;
    }
  }, [getClerkToken]);

  // Fetch token on mount
  useEffect(() => {
    if (!isLoaded) return;

    const fetchToken = async () => {
      setIsLoading(true);
      await getToken();
      setIsLoading(false);
    };

    fetchToken();
  }, [isLoaded, getToken]);

  return {
    token,
    isLoading: !isLoaded || isLoading,
    getToken,
  };
}

export default useAuthToken;
