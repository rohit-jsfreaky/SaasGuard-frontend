import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-primary/10 via-background to-purple-500/5 border-r border-border/40">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center">
            <img
              src="/saasguard_full.png"
              alt="SaasGuard"
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl font-bold tracking-tight">
              Manage your SaaS features with confidence
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Control feature flags, manage user permissions, and track usage
              across your entire application from one powerful dashboard.
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-4 pt-4">
            {[
              "Real-time feature flag management",
              "Granular user permission controls",
              "Comprehensive usage analytics",
              "Role-based access control",
            ].map((feature, idx) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SaasGuard. All rights reserved.
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12">
        {/* Mobile header */}
        <div className="lg:hidden w-full max-w-md mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
          <div className="flex items-center mb-4">
            <img
              src="/saasguard_full.png"
              alt="SaasGuard"
              className="h-16 w-auto object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground mt-1">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Desktop heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block text-center mb-8 max-w-md"
        >
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </motion.div>

        {/* Clerk Sign In Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-background/80 backdrop-blur-sm border border-border/60 shadow-2xl rounded-2xl",
                headerTitle: "text-foreground",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton:
                  "bg-muted/50 border-border/60 hover:bg-muted text-foreground",
                socialButtonsBlockButtonText: "text-foreground font-medium",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground",
                formFieldLabel: "text-foreground",
                formFieldInput:
                  "bg-background border-border/60 text-foreground focus:border-primary focus:ring-primary",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-primary-foreground font-medium",
                footerActionLink: "text-primary hover:text-primary/80",
                identityPreviewText: "text-foreground",
                identityPreviewEditButton: "text-primary",
                formFieldAction: "text-primary hover:text-primary/80",
                alertText: "text-foreground",
                formFieldInputShowPasswordButton: "text-muted-foreground",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
            }}
            routing="path"
            path="/login"
            signUpUrl="/signup"
            fallbackRedirectUrl="/dashboard"
          />
        </motion.div>

        {/* Additional links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign up for free
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
