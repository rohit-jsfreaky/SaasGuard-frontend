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
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { featuresService } from "@/services/features.service";
import { plansService } from "@/services/plans.service";
import type { Feature } from "@/types/entities";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddFeatureToPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: number;
  existingFeatureIds: number[];
  onSuccess: () => void;
}

export function AddFeatureToPlanModal({
  isOpen,
  onClose,
  planId,
  existingFeatureIds,
  onSuccess,
}: AddFeatureToPlanModalProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>("");
  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFeatures();
    }
  }, [isOpen]);

  const fetchFeatures = async () => {
    setIsFetching(true);
    try {
      const response = await featuresService.getAll(1, 100);
      // Filter out features already in the plan
      const availableFeatures = response.data.filter(
        (f) => !existingFeatureIds.includes(Number(f.id))
      );
      setFeatures(availableFeatures);
    } catch (err) {
      toast.error("Failed to load features");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFeatureId) {
      toast.error("Please select a feature");
      return;
    }

    setIsLoading(true);
    try {
      await plansService.addFeature(planId, Number(selectedFeatureId), enabled);
      toast.success("Feature added to plan");
      onSuccess();
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to add feature");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFeatureId("");
    setEnabled(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Feature to Plan</DialogTitle>
          <DialogDescription>
            Select a feature to add to this plan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="feature">Feature</Label>
            <Select
              value={selectedFeatureId}
              onValueChange={setSelectedFeatureId}
              disabled={isFetching}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={isFetching ? "Loading..." : "Select a feature"}
                />
              </SelectTrigger>
              <SelectContent>
                {features.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No available features
                  </SelectItem>
                ) : (
                  features.map((feature) => (
                    <SelectItem key={feature.id} value={String(feature.id)}>
                      {feature.name} ({feature.slug})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedFeatureId}>
              {isLoading ? "Adding..." : "Add Feature"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
