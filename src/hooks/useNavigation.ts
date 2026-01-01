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
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Features",
      href: "/features",
      icon: Layers,
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
      title: "Overrides",
      href: "/overrides",
      icon: Shield,
    },
    {
      title: "Users",
      href: "/users",
      icon: UserCog,
    },
    {
      title: "Usage",
      href: "/usage",
      icon: BarChart,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const breadcrumbs = location.pathname
    .split("/")
    .filter((path) => path)
    .map((path) => ({
      title: path.charAt(0).toUpperCase() + path.slice(1),
      href: `/${path}`,
    }));

  return {
    navItems,
    breadcrumbs,
    currentPath: location.pathname,
  };
};
