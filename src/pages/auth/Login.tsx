/**
 * Sign In Page
 * Clerk authentication page
 */

import { SignIn } from "@clerk/clerk-react";
import { Shield } from "lucide-react";

/**
 * Sign In page component
 */
export function Login() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 dark:bg-primary/10 items-center justify-center p-12">
        <div className="max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">SaaS Guard</h1>
          <p className="text-lg text-muted-foreground">
            Centralized permission and entitlement management for your SaaS
            applications
          </p>
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="rounded-lg bg-background/50 p-4 text-center">
              <div className="text-2xl font-bold">Features</div>
              <div className="text-sm text-muted-foreground">
                Manage permissions
              </div>
            </div>
            <div className="rounded-lg bg-background/50 p-4 text-center">
              <div className="text-2xl font-bold">Plans</div>
              <div className="text-sm text-muted-foreground">
                Control access
              </div>
            </div>
            <div className="rounded-lg bg-background/50 p-4 text-center">
              <div className="text-2xl font-bold">Roles</div>
              <div className="text-sm text-muted-foreground">
                Group permissions
              </div>
            </div>
            <div className="rounded-lg bg-background/50 p-4 text-center">
              <div className="text-2xl font-bold">Overrides</div>
              <div className="text-sm text-muted-foreground">
                User exceptions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile branding */}
          <div className="lg:hidden text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">SaaS Guard</h1>
          </div>

          {/* Clerk Sign In */}
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 w-full",
                headerTitle: "text-2xl font-bold",
                headerSubtitle: "text-muted-foreground",
                formButtonPrimary: "bg-primary hover:bg-primary/90",
                formFieldInput: "border-input",
                footerActionLink: "text-primary hover:text-primary/90",
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
