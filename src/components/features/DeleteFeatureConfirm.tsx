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
import { useFeaturesModalStore } from "@/store/features-modal.store";
import { useFeaturesStore } from "@/store/features.store";
import { useState } from "react";

export function DeleteFeatureConfirm() {
  const { isOpen, type, data, closeModal } = useFeaturesModalStore();
  const removeFeature = useFeaturesStore((state) => state.removeFeature);
  const [isDeleting, setIsDeleting] = useState(false);

  const isModalOpen = isOpen && type === "delete" && !!data;

  const handleDelete = async () => {
    if (!data) return;

    setIsDeleting(true);
    const success = await removeFeature(data.id);
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
            This action cannot be undone. This will permanently delete the
            feature
            <span className="font-semibold text-foreground">
              {" "}
              "{data?.name}"{" "}
            </span>
            and remove it from our servers.
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
            {isDeleting ? "Deleting..." : "Delete Feature"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
