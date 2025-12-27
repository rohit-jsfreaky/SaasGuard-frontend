import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import api from "@/services/api.client";
import { usersService } from "@/services/users.service";
import type { User } from "@/types/entities";

export const useAuth = () => {
  const { user: clerkUser, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Combined effect to handle token setting and user syncing sequentially
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isUserLoaded) return;


      console.log("Auth state changed. isSignedIn:", isSignedIn, "clerkUser:", clerkUser);

      if (isSignedIn && clerkUser) {
        try {
          // 1. Get and set token FIRST
          const token = await getToken();
          console.log("Obtained token from Clerk:", token);
          if (token) {
            api.setAuthToken(token);
          } else {
            console.warn("No token available");
          }

          // 2. Now safe to make API calls
          try {
            const response = await usersService.getCurrent();
            setUser(response.data);
          } catch (error: any) {
            // If user not found (404) or other error, try to sync
            const email = clerkUser.primaryEmailAddress?.emailAddress;
            if (email) {
              try {
                const syncResponse = await usersService.sync(clerkUser.id, email);
                setUser(syncResponse.data);
              } catch (syncError) {
                console.error("Failed to sync user:", syncError);
              }
            }
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Not signed in
        api.setAuthToken(null);
        setUser(null);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isSignedIn, clerkUser, isUserLoaded, getToken]);

  const logout = async () => {
    await signOut();
    api.setAuthToken(null);
    setUser(null);
    localStorage.removeItem("saas-guard-user"); // If we were caching it
  };

  return {
    user,
    clerkUser,
    isLoading: isLoading || !isUserLoaded,
    isSignedIn,
    logout,
    getToken,
  };
};
