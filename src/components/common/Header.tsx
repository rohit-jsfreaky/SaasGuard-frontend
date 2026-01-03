import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { ThemeToggle } from "./ThemeToggle";
import { UserNav } from "./UserNav";
import { OrganizationSwitcher } from "./OrganizationSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-14 sm:h-16 shrink-0 items-center gap-1 sm:gap-2 border-b bg-background/70 px-3 sm:px-6 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-2 sm:gap-3">
        <SidebarTrigger className="-ml-1 sm:-ml-2 h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:bg-accent hover:text-foreground" />
        <Separator
          orientation="vertical"
          className="mr-1 sm:mr-2 h-4 hidden sm:block"
        />
        {/* Hide breadcrumb on mobile, show on sm+ */}
        <div className="hidden sm:block">
          <BreadcrumbNav />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <OrganizationSwitcher />
        <div className="flex items-center gap-1 sm:gap-2 pl-2 border-l">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
