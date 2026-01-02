import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useNavigation } from "@/hooks/useNavigation";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const { navItems, currentPath } = useNavigation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild isActive={currentPath === "/dashboard"}>
              <Link to="/dashboard">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl text-sidebar-primary-foreground">
                  <img
                    src="/logo.png"
                    alt="SaaS Guard"
                    className="size-full object-contain drop-shadow-sm"
                  />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-bold text-lg tracking-tight">
                    SaaS Guard
                  </span>
                  <span className="truncate text-xs text-muted-foreground font-medium">
                    Enterprise Edition
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  currentPath === item.href ||
                  (item.href !== "/" && currentPath.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* User menu can go here or in the header */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
