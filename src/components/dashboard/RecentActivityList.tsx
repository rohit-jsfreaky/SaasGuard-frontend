import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface ActivityItem {
  id: number;
  type: "override" | "role" | "feature";
  title: string;
  description: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  timestamp: string;
}

// Mock data generator for activity if not provided
const generateMockActivity = (): ActivityItem[] => [
  {
    id: 1,
    type: "override",
    title: "New Override Created",
    description: "API limit increased for user@example.com",
    user: { name: "Admin", email: "admin@saasguard.com" },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 2,
    type: "role",
    title: "Role Assigned",
    description: 'Assigned "Editor" role to new user',
    user: { name: "Manager", email: "manager@saasguard.com" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 3,
    type: "feature",
    title: "Feature Updated",
    description: 'Updated "SSO" feature configuration',
    user: { name: "Dev", email: "dev@saasguard.com" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function RecentActivityList() {
  const activities = generateMockActivity();

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions across your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((item) => {
            return (
              <div key={item.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={item.user?.avatar} alt={item.user?.name} />
                  <AvatarFallback>
                    {item.type === "override"
                      ? "OV"
                      : item.type === "role"
                      ? "RO"
                      : "FE"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            );
          })}

          <Link
            to="/audit-logs"
            className="flex items-center text-sm text-primary hover:underline pt-2"
          >
            View all activity <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
