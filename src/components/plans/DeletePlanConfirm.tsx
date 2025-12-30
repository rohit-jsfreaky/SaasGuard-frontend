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
import { usePlansModalStore } from "@/store/plans-modal.store";
import { usePlansStore } from "@/store/plans.store";
import { useState } from "react";

export function DeletePlanConfirm() {
  const { isOpen, type, data, closeModal } = usePlansModalStore();
  const removePlan = usePlansStore((state) => state.removePlan);
  const [isDeleting, setIsDeleting] = useState(false);

  const isModalOpen = isOpen && type === "delete" && !!data;

  const handleDelete = async () => {
    if (!data) return;

    setIsDeleting(true);
    const success = await removePlan(data.id);
    setIsDeleting(false);

    if (success) {
      closeModal();
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the plan
            <span className="font-semibold text-foreground">
              {" "}
              "{data?.name}"{" "}
            </span>
            and remove all associated features and limits.
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
            {isDeleting ? "Deleting..." : "Delete Plan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
