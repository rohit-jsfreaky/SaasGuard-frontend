import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import api from "@/services/api.client";
import { usersService } from "@/services/users.service";
import type { User } from "@/types/entities";

export const useAuth = () => {
  const { user: clerkUser, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenGetterSet = useRef(false);

  // Set up the token getter ONCE when getToken is available
  useEffect(() => {
    if (getToken && !tokenGetterSet.current) {
      // Pass the getToken function to the API client
      // This function will be called for EVERY request to get a fresh token
      api.setTokenGetter(async () => {
        try {
          // Clerk's getToken() always returns a fresh/valid token
          // It uses internal caching and refreshes automatically
          const token = await getToken();
          return token;
        } catch (error) {
          console.error("Failed to get token from Clerk:", error);
          return null;
        }
      });
      tokenGetterSet.current = true;
      console.log("Token getter set up for API client");
    }
  }, [getToken]);

  // Handle user sync when signed in
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isUserLoaded) return;

      console.log(
        "Auth state changed. isSignedIn:",
        isSignedIn,
        "clerkUser:",
        clerkUser
      );

      if (isSignedIn && clerkUser) {
        try {
          // Get current user from API
          try {
            const response = await usersService.getCurrent();
            setUser(response.data);
          } catch (error: any) {
            // If user not found (404) or other error, try to sync
            const email = clerkUser.primaryEmailAddress?.emailAddress;
            if (email) {
              try {
                const syncResponse = await usersService.sync(
                  clerkUser.id,
                  email
                );
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
        // Not signed in - clear the token getter
        setUser(null);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isSignedIn, clerkUser, isUserLoaded]);

  const logout = async () => {
    await signOut();
    setUser(null);
    localStorage.removeItem("saas-guard-user");
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
