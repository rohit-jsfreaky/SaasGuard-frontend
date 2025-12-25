import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoles } from "@/hooks/useRoles";
import { useOrganization } from "@/hooks/useOrganization";
import {
  RoleTable,
  CreateRoleModal,
  EditRoleModal,
  DeleteRoleConfirm,
} from "@/components/roles";
import type { Role } from "@/types";

export default function Roles() {
  const { orgId } = useOrganization();
  const { roles, fetchRoles, isLoading } = useRoles();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  useEffect(() => {
    if (orgId) {
      fetchRoles(orgId);
    }
  }, [orgId, fetchRoles]);

  if (!orgId) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="text-lg font-medium text-muted-foreground">
          Please select an organization to manage roles
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage roles and permissions for your organization members.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      <RoleTable
        roles={roles}
        isLoading={isLoading}
        onEdit={setEditingRole}
        onDelete={setDeletingRole}
      />

      <CreateRoleModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <EditRoleModal
        role={editingRole}
        open={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
      />

      <DeleteRoleConfirm
        role={deletingRole}
        open={!!deletingRole}
        onOpenChange={(open) => !open && setDeletingRole(null)}
      />
    </div>
  );
}
