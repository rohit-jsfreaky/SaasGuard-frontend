import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SetLimitModalProps {
  featureName: string;
  currentLimit?: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (limit?: number) => Promise<boolean>;
}

export function SetLimitModal({
  featureName,
  currentLimit,
  open,
  onOpenChange,
  onSubmit,
}: SetLimitModalProps) {
  const [limit, setLimit] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setLimit(currentLimit?.toString() ?? "");
    }
  }, [open, currentLimit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const success = await onSubmit(limitNum);
    setIsSubmitting(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Limit for {featureName}</DialogTitle>
          <DialogDescription>
            Define the maximum usage limit for this feature. Leave empty for
            unlimited.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Limit Amount</Label>
            <Input
              type="number"
              placeholder="Unlimited"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min="0"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Limit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
