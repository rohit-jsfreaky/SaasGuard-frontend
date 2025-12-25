/**
 * Protected Route Component
 * Redirects unauthenticated users to login
 */

import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Loading component shown during auth check
 */
function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <div className="space-y-2 text-center">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}

/**
 * Protected Route component
 * Ensures user is authenticated before rendering children
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (!isLoaded) {
    return <AuthLoadingScreen />;
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Render protected content
  return <>{children}</>;
}

export default ProtectedRoute;
