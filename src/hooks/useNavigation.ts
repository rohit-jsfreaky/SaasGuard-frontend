import { 
  LayoutDashboard, 
  Layers, 
  Briefcase, 
  Users, 
  Shield, 
  Settings, 
  UserCog,
  BarChart  
} from "lucide-react";
import { useLocation } from "react-router-dom";

export const useNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Features",
      href: "/dashboard/features",
      icon: Layers,
    },
    {
      title: "Plans",
      href: "/dashboard/plans",
      icon: Briefcase,
    },
    {
      title: "Roles",
      href: "/dashboard/roles",
      icon: Users,
    },
    {
      title: "Overrides",
      href: "/dashboard/overrides",
      icon: Shield,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: UserCog,
    },
    {
      title: "Usage",
      href: "/dashboard/usage",
      icon: BarChart,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const breadcrumbs = location.pathname
    .split("/")
    .filter((path) => path)
    .map((path, index, array) => ({
      title: path.charAt(0).toUpperCase() + path.slice(1),
      href: "/" + array.slice(0, index + 1).join("/"),
    }));

  return {
    navItems,
    breadcrumbs,
    currentPath: location.pathname,
  };
};
