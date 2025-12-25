/**
 * Auth Provider Component
 * Wraps app with Clerk authentication and initializes API client
 */

import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { type ReactNode, useEffect } from "react";
import { initializeApi } from "@/services/api";

/**
 * Get Clerk publishable key from environment
 */
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

/**
 * API initializer - ensures API client has access to auth tokens
 */
function ApiInitializer({ children }: { children: ReactNode }) {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      // Initialize the API client with Clerk's getToken function
      initializeApi(async () => {
        try {
          const token = await getToken();
          return token;
        } catch (error) {
          console.warn("[Auth] Failed to get token:", error);
          return null;
        }
      });
    }
  }, [isLoaded, getToken]);

  return <>{children}</>;
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider component
 * Configures Clerk for the application
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/sign-in"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <ApiInitializer>{children}</ApiInitializer>
    </ClerkProvider>
  );
}

export default AuthProvider;
