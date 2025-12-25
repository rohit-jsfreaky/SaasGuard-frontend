/**
 * SaaS Guard - Admin Dashboard
 * Root application component with routing and authentication
 */

import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary, AppLayout } from "@/components/common";
import { AuthProvider, ProtectedRoute } from "@/components/auth";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages for code splitting
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Features = lazy(() => import("@/pages/Features"));
const Plans = lazy(() => import("@/pages/Plans"));
const PlanDetail = lazy(() => import("@/pages/PlanDetail"));
const Roles = lazy(() => import("@/pages/Roles"));
const Overrides = lazy(() => import("@/pages/Overrides"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Auth pages
const Login = lazy(() => import("@/pages/auth/Login"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));

/**
 * Loading fallback component
 */
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 w-full max-w-md p-8">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * Root App component
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/sign-in/*" element={<Login />} />
              <Route path="/sign-up/*" element={<SignUp />} />

              {/* Protected Admin Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/features" element={<Features />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/plans/:id" element={<PlanDetail />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/overrides" element={<Overrides />} />

                {/* Placeholders for routes in sidebar */}
                <Route
                  path="/users"
                  element={
                    <div className="p-4">Users Management (Coming Soon)</div>
                  }
                />
                <Route
                  path="/settings"
                  element={<div className="p-4">Settings (Coming Soon)</div>}
                />
              </Route>

              {/* 404 - Outside layout for full screen */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          {/* Global toast notifications */}
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
