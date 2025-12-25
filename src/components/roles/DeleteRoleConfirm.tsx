import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRoles } from "@/hooks/useRoles";
import type { Role } from "@/types";

interface DeleteRoleConfirmProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteRoleConfirm({
  role,
  open,
  onOpenChange,
}: DeleteRoleConfirmProps) {
  const { removeRole, isDeleting } = useRoles();

  const handleConfirm = async () => {
    if (!role) return;
    const success = await removeRole(role.id);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Role?</DialogTitle>
          <DialogDescription>
            This will permanently delete the role
            <span className="font-semibold text-foreground">
              {" "}
              {role?.name}{" "}
            </span>
            . Users assigned to this role may lose access to associated
            features.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
