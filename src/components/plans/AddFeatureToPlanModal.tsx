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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFeatures } from "@/hooks/useFeatures";

interface AddFeatureToPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    featureId: number,
    enabled: boolean,
    limit?: number
  ) => Promise<boolean>;
  existingFeatureIds: number[];
}

export function AddFeatureToPlanModal({
  open,
  onOpenChange,
  onSubmit,
  existingFeatureIds,
}: AddFeatureToPlanModalProps) {
  const { features, fetchFeatures } = useFeatures();
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [limit, setLimit] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchFeatures();
      // Reset form
      setSelectedFeatureId("");
      setIsEnabled(true);
      setLimit("");
    }
  }, [open, fetchFeatures]);

  // Filter out features already assigned
  const availableFeatures = features.filter(
    (f) => !existingFeatureIds.includes(f.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeatureId) return;

    setIsSubmitting(true);
    const limitNum = limit ? parseInt(limit, 10) : undefined;

    // We pass number id
    const success = await onSubmit(
      parseInt(selectedFeatureId, 10),
      isEnabled,
      limitNum
    );

    setIsSubmitting(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Feature to Plan</DialogTitle>
          <DialogDescription>
            Assign a feature to this plan and configure its limits.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Feature</Label>
            <Select
              value={selectedFeatureId}
              onValueChange={setSelectedFeatureId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a feature" />
              </SelectTrigger>
              <SelectContent>
                {availableFeatures.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No available features
                  </div>
                ) : (
                  availableFeatures.map((f) => (
                    <SelectItem key={f.id} value={f.id.toString()}>
                      {f.name} ({f.slug})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2 rounded-md border p-3">
            <div className="space-y-0.5">
              <Label>Enabled by Default</Label>
              <p className="text-xs text-muted-foreground">
                Whether this feature is accessible.
              </p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>

          <div className="space-y-2">
            <Label>Limit (Optional)</Label>
            <Input
              type="number"
              placeholder="e.g. 100 (Leave empty for unlimited)"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min="0"
            />
            <p className="text-xs text-muted-foreground">
              Maximum usage allowed (null means unlimited).
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedFeatureId}>
              {isSubmitting ? "Adding..." : "Add Feature"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
