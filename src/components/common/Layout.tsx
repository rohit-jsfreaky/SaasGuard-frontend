/**
 * Layout Component
 * Main application layout structure
 */

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import { NotificationCenter } from "./NotificationCenter";

/**
 * Layout component
 */
export function Layout() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
      {/* Sidebar - Desktop */}
      <div
        className={cn(
          "hidden border-r bg-muted/40 md:block transition-all duration-300",
          sidebarCollapsed && "md:grid-cols-[60px]" // Logic handled in main grid if using dynamic cols,
          // but here we might need to adjust parent grid layout based on collapse.
          // For simplicity with this grid setup, let's keep fixed width for now or adjust logic.
          // To make it truly collapsible with grid, we'd need to change the grid-template-columns of the parent div.
          // Let's stick to simple fixed width or use a class to modify parent style.
        )}
        style={
          sidebarCollapsed ? { width: "60px", minWidth: "60px" } : undefined
        }
        // Note: The parent 'grid-cols' won't update automatically with just this div style.
        // Better approach: Move sidebarCollapsed to parent class or use flex.
      >
        <Sidebar className="h-full" />
      </div>

      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40 overflow-x-hidden">
          <BreadcrumbNav />
          <div className="flex-1 rounded-lg border border-dashed shadow-sm bg-background p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      <NotificationCenter />
    </div>
  );
}

// Wrapper for parent grid styling
export function AppLayout() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  return (
    <div
      className={cn(
        "grid min-h-screen w-full transition-all duration-300",
        sidebarCollapsed
          ? "md:grid-cols-[60px_1fr]"
          : "md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]"
      )}
    >
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar className="h-full" />
      </div>
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/10 overflow-x-hidden">
          <BreadcrumbNav />
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
      <NotificationCenter />
    </div>
  );
}

export default AppLayout;
