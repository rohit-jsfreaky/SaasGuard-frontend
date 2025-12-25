/**
 * Sidebar Component
 * Main navigation sidebar with collapsible state
 */

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Component,
  Briefcase,
  Users,
  Shield,
  UserCog,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUIStore } from "@/store/ui.store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

/**
 * Navigation items
 */
const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Features",
    href: "/features",
    icon: Component,
  },
  {
    title: "Plans",
    href: "/plans",
    icon: Briefcase,
  },
  {
    title: "Roles",
    href: "/roles",
    icon: Users,
  },
  {
    title: "Users",
    href: "/users",
    icon: UserCog,
  },
  {
    title: "Overrides",
    href: "/overrides",
    icon: Shield,
  },
];

const bottomItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
}

/**
 * Sidebar component
 */
export function Sidebar({ className, isMobile }: SidebarProps) {
  const location = useLocation();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  // On mobile, sidebar is not collapsed in the same way (it's in a sheet)
  const isCollapsed = !isMobile && sidebarCollapsed;

  const NavItem = ({ item }: { item: (typeof navItems)[0] }) => {
    const isActive =
      location.pathname === item.href ||
      (item.href !== "/" && location.pathname.startsWith(item.href));

    const Icon = item.icon;

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to={item.href}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.title}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Link
        to={item.href}
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground" : "transparent"
        )}
      >
        <Icon className="mr-2 h-4 w-4" />
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-background border-r",
        className
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b px-3",
          isCollapsed ? "justify-center" : "gap-2"
        )}
      >
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          {!isCollapsed && <span>SaaS Guard</span>}
        </div>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t p-2">
        <nav className="grid gap-1">
          {bottomItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
