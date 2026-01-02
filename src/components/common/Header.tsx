import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { ThemeToggle } from "./ThemeToggle";
import { UserNav } from "./UserNav";
import { OrganizationSwitcher } from "./OrganizationSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/70 px-6 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-2 h-9 w-9 text-muted-foreground hover:bg-accent hover:text-foreground" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbNav />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <OrganizationSwitcher />
        <div className="flex items-center gap-2 pl-2 border-l">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
