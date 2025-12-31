import { Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleTable } from "@/components/roles/RoleTable";
import { CreateRoleModal } from "@/components/roles/CreateRoleModal";
import { EditRoleModal } from "@/components/roles/EditRoleModal";
import { DeleteRoleConfirm } from "@/components/roles/DeleteRoleConfirm";
import { useRoles } from "@/hooks/useRoles";
import { useRolesModalStore } from "@/store/roles-modal.store";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export default function Roles() {
  const {
    roles,
    isLoading,
    page,
    totalPages,
    setPage,
    setSearch,
    organizationId,
  } = useRoles();

  const { openModal } = useRolesModalStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  if (!organizationId) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Organization Selected</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-md">
          To manage roles, you need to select or create an organization. Use the
          organization dropdown in the header to create your first organization.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage roles and permissions for your organization.
          </p>
        </div>
        <Button onClick={() => openModal("create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <RoleTable
        roles={roles}
        isLoading={isLoading}
        onEdit={(role) => openModal("edit", role)}
        onDelete={(role) => openModal("delete", role)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CreateRoleModal />
      <EditRoleModal />
      <DeleteRoleConfirm />
    </div>
  );
}
