import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import type { Plan } from "@/types/entities";
import { Badge } from "@/components/ui/badge";

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
  currentPlanId?: number;
  onSubmit: (planId: number) => Promise<boolean>;
}

export function ChangePlanModal({
  isOpen,
  onClose,
  plans,
  currentPlanId,
  onSubmit,
}: ChangePlanModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedPlanId(currentPlanId?.toString() || "");
    }
  }, [isOpen, currentPlanId]);

  const selectedPlan = plans.find((p) => p.id === Number(selectedPlanId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlanId) return;

    setIsSubmitting(true);
    const success = await onSubmit(Number(selectedPlanId));
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Change Plan</DialogTitle>
          <DialogDescription>
            Select a plan to assign to this user.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Plan</Label>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={String(plan.id)}>
                    <div className="flex items-center gap-2">
                      <span>{plan.name}</span>
                      {plan.featuresCount && (
                        <Badge variant="secondary" className="text-xs">
                          {plan.featuresCount} features
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPlan && (
            <div className="rounded-md border p-3 bg-accent/50">
              <p className="text-sm font-medium">{selectedPlan.name}</p>
              {selectedPlan.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedPlan.description}
                </p>
              )}
              <Badge variant="outline" className="mt-2 font-mono text-xs">
                {selectedPlan.slug}
              </Badge>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedPlanId}>
              {isSubmitting ? "Assigning..." : "Assign Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
