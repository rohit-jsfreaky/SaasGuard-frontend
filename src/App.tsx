import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/hooks/useTheme"
import { Layout } from "@/components/common/Layout"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import Dashboard from "@/pages/Dashboard"
import NotFound from "@/pages/NotFound"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="saas-guard-theme">
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              {/* Add other routes here */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
