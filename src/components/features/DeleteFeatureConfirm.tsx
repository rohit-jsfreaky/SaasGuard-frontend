import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFeatures } from "@/hooks/useFeatures";
import type { Feature } from "@/types";

interface DeleteFeatureConfirmProps {
  feature: Feature | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteFeatureConfirm({
  feature,
  open,
  onOpenChange,
}: DeleteFeatureConfirmProps) {
  const { removeFeature, isDeleting } = useFeatures();

  const handleConfirm = async () => {
    if (!feature) return;
    const success = await removeFeature(feature.id);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            feature
            <span className="font-semibold text-foreground">
              {" "}
              {feature?.name}{" "}
            </span>
            and remove it from our servers.
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
