import { useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useOrganization } from "@/hooks/useOrganization";
import { UserTable } from "@/components/users";

export default function Users() {
  const { orgId } = useOrganization();
  const { users, fetchUsers, isLoading } = useUsers();

  useEffect(() => {
    if (orgId) {
      fetchUsers(orgId);
    }
  }, [orgId, fetchUsers]);

  if (!orgId) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="text-lg font-medium text-muted-foreground">
          Please select an organization to manage users
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users, assign plans, and control role-based access.
          </p>
        </div>
      </div>

      <UserTable users={users} isLoading={isLoading} />
    </div>
  );
}
