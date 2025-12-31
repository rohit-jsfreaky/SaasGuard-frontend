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
import { useOverridesModalStore } from "@/store/overrides-modal.store";
import { useOverridesStore } from "@/store/overrides.store";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function DeleteOverrideConfirm() {
  const { isOpen, type, data, closeModal } = useOverridesModalStore();
  const deleteOverride = useOverridesStore((state) => state.deleteOverride);
  const [isDeleting, setIsDeleting] = useState(false);

  const isModalOpen = isOpen && type === "delete" && !!data;

  const handleDelete = async () => {
    if (!data) return;

    setIsDeleting(true);
    const success = await deleteOverride(data.id);
    setIsDeleting(false);

    if (success) {
      closeModal();
    }
  };

  const getOverrideTypeLabel = (type: string) => {
    switch (type) {
      case "feature_enable":
        return "Enable";
      case "feature_disable":
        return "Disable";
      case "limit_increase":
        return "Limit Increase";
      default:
        return type;
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Override?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete this override? This action cannot
              be undone.
            </p>
            {data && (
              <div className="flex gap-2 pt-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {data.featureSlug}
                </Badge>
                <Badge variant="secondary">
                  {getOverrideTypeLabel(data.overrideType)}
                </Badge>
              </div>
            )}
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
            {isDeleting ? "Deleting..." : "Delete Override"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
