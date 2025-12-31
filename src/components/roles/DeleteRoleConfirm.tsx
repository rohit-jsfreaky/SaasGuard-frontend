import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRolesModalStore } from "@/store/roles-modal.store";
import { useRolesStore } from "@/store/roles.store";
import { useState } from "react";

export function DeleteRoleConfirm() {
  const { isOpen, type, data, closeModal } = useRolesModalStore();
  const removeRole = useRolesStore((state) => state.removeRole);
  const [isDeleting, setIsDeleting] = useState(false);

  const isModalOpen = isOpen && type === "delete" && !!data;

  const handleDelete = async () => {
    if (!data) return;

    setIsDeleting(true);
    const success = await removeRole(data.id);
    setIsDeleting(false);

    if (success) {
      closeModal();
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the role
            <span className="font-semibold text-foreground">
              {" "}
              "{data?.name}"{" "}
            </span>
            and remove all associated permissions. Users with this role will
            lose access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Role"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
