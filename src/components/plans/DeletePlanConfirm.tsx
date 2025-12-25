import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/hooks/usePlans";
import type { Plan } from "@/types";

interface DeletePlanConfirmProps {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePlanConfirm({
  plan,
  open,
  onOpenChange,
}: DeletePlanConfirmProps) {
  const { removePlan, isDeleting } = usePlans();

  const handleConfirm = async () => {
    if (!plan) return;
    const success = await removePlan(plan.id);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Plan?</DialogTitle>
          <DialogDescription>
            This will permanently delete the plan
            <span className="font-semibold text-foreground">
              {" "}
              {plan?.name}{" "}
            </span>
            . This action cannot be undone.
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
