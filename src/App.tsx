import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { Layout } from "@/components/common/Layout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Lazy load page components for code splitting
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Features = lazy(() => import("@/pages/Features"));
const Plans = lazy(() => import("@/pages/Plans"));
const PlanDetail = lazy(() => import("@/pages/PlanDetail"));
const Roles = lazy(() => import("@/pages/Roles"));
const RoleDetail = lazy(() => import("@/pages/RoleDetail"));
const Overrides = lazy(() => import("@/pages/Overrides"));
const Users = lazy(() => import("@/pages/Users"));
const UserDetail = lazy(() => import("@/pages/UserDetail"));
const Usage = lazy(() => import("@/pages/Usage"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Docs = lazy(() => import("@/pages/Docs"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));

// Loading fallback for lazy loaded pages
function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="saas-guard-theme">
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <LandingPage />
                  </Suspense>
                }
              />
              <Route
                path="/docs"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Docs />
                  </Suspense>
                }
              />
              <Route
                path="/login/*"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Login />
                  </Suspense>
                }
              />
              <Route
                path="/signup/*"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Signup />
                  </Suspense>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Dashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="features"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Features />
                    </Suspense>
                  }
                />
                <Route
                  path="plans"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Plans />
                    </Suspense>
                  }
                />
                <Route
                  path="plans/:planId"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <PlanDetail />
                    </Suspense>
                  }
                />
                <Route
                  path="roles"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Roles />
                    </Suspense>
                  }
                />
                <Route
                  path="roles/:roleId"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <RoleDetail />
                    </Suspense>
                  }
                />
                <Route
                  path="overrides"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Overrides />
                    </Suspense>
                  }
                />
                <Route
                  path="users"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Users />
                    </Suspense>
                  }
                />
                <Route
                  path="users/:userId"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <UserDetail />
                    </Suspense>
                  }
                />
                <Route
                  path="usage"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Usage />
                    </Suspense>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Settings />
                    </Suspense>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <NotFound />
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
