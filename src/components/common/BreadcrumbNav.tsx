/**
 * Breadcrumb Navigation Component
 * Displays current page path using shadcn breadcrumb component
 */

import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * Route name mapping
 */
const ROUTE_NAMES: Record<string, string> = {
  features: "Features",
  plans: "Plans",
  roles: "Roles",
  users: "Users",
  overrides: "Overrides",
  settings: "Settings",
  create: "Create",
  edit: "Edit",
};

/**
 * BreadcrumbNav component
 */
export function BreadcrumbNav() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show on dashboard
  if (pathnames.length === 0) return null;

  return (
    <Breadcrumb className="hidden md:flex mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          // Format name (capitalize or lookup)
          const name =
            ROUTE_NAMES[value] ||
            value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <div key={to} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem className="ml-2">
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbNav;
