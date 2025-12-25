import { useState, useCallback } from "react";
import { useDataStore } from "@/store/data.store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import type { Role } from "@/types";
import { rolesService } from "@/services";

export function useRoles() {
  const { roles, loading, fetchRoles, addRole, updateRole, deleteRole } =
    useDataStore(
      useShallow((state) => ({
        roles: state.roles,
        loading: state.loading.roles,
        fetchRoles: state.fetchRoles,
        addRole: state.addRole,
        updateRole: state.updateRole,
        deleteRole: state.deleteRole,
      }))
    );

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createRole = useCallback(
    async (data: Partial<Role> & { organizationId: number }) => {
      try {
        setIsCreating(true);
        const response = await rolesService.create({
          name: data.name!,
          slug: data.slug!,
          description: data.description,
          organizationId: data.organizationId,
        });
        addRole(response.data);
        toast.success("Role created successfully");
        return true;
      } catch (error) {
        toast.error("Failed to create role");
        console.error(error);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [addRole]
  );

  const editRole = useCallback(
    async (id: number, data: Partial<Role>) => {
      try {
        setIsUpdating(true);
        const response = await rolesService.update(id, data);
        updateRole(id, response.data);
        toast.success("Role updated successfully");
        return true;
      } catch (error) {
        toast.error("Failed to update role");
        console.error(error);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [updateRole]
  );

  const removeRole = useCallback(
    async (id: number) => {
      try {
        setIsDeleting(true);
        await rolesService.delete(id);
        deleteRole(id);
        toast.success("Role deleted successfully");
        return true;
      } catch (error) {
        toast.error("Failed to delete role");
        console.error(error);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteRole]
  );

  return {
    roles,
    isLoading: loading,
    isCreating,
    isUpdating,
    isDeleting,
    fetchRoles,
    createRole,
    editRole,
    removeRole,
  };
}
