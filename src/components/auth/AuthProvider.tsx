/**
 * Auth Provider Component
 * Wraps app with Clerk authentication
 */

import { ClerkProvider } from "@clerk/clerk-react";
import type { ReactNode } from "react";

/**
 * Get Clerk publishable key from environment
 */
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
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
      {children}
    </ClerkProvider>
  );
}

export default AuthProvider;
