import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { plansService } from "@/services/plans.service";
import type { PlanFeature, PlanLimit } from "@/types/entities";
import { toast } from "sonner";

interface SetLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: number;
  feature: PlanFeature | null;
  currentLimit?: PlanLimit;
  onSuccess: () => void;
}

export function SetLimitModal({
  isOpen,
  onClose,
  planId,
  feature,
  currentLimit,
  onSuccess,
}: SetLimitModalProps) {
  const [maxLimit, setMaxLimit] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentLimit) {
      setMaxLimit(String(currentLimit.maxLimit));
    } else {
      setMaxLimit("");
    }
    setError(null);
  }, [isOpen, currentLimit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feature) return;

    const limitValue = parseInt(maxLimit, 10);

    if (isNaN(limitValue) || limitValue <= 0) {
      setError("Please enter a positive number");
      return;
    }

    setIsLoading(true);
    try {
      await plansService.setLimit(planId, feature.slug, limitValue);
      toast.success("Limit set successfully");
      onSuccess();
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to set limit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMaxLimit("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Feature Limit</DialogTitle>
          <DialogDescription>
            Set a usage limit for this feature.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="feature-name">Feature</Label>
            <Input
              id="feature-name"
              value={feature?.name || ""}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="max-limit">Max Limit</Label>
            <Input
              id="max-limit"
              type="number"
              min="1"
              value={maxLimit}
              onChange={(e) => {
                setMaxLimit(e.target.value);
                setError(null);
              }}
              placeholder="e.g. 1000"
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">
              Enter a positive number for the maximum usage limit.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !maxLimit}>
              {isLoading ? "Saving..." : "Set Limit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
