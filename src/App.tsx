import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { Layout } from "@/components/common/Layout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Features from "@/pages/Features";
import Plans from "@/pages/Plans";
import PlanDetail from "@/pages/PlanDetail";
import Roles from "@/pages/Roles";
import RoleDetail from "@/pages/RoleDetail";
import Overrides from "@/pages/Overrides";
import Users from "@/pages/Users";
import UserDetail from "@/pages/UserDetail";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

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
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="features" element={<Features />} />
                <Route path="plans" element={<Plans />} />
                <Route path="plans/:planId" element={<PlanDetail />} />
                <Route path="roles" element={<Roles />} />
                <Route path="roles/:roleId" element={<RoleDetail />} />
                <Route path="overrides" element={<Overrides />} />
                <Route path="users" element={<Users />} />
                <Route path="users/:userId" element={<UserDetail />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
