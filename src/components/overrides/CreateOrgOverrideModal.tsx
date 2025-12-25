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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useOverrides } from "@/hooks/useOverrides";
import { useFeatures } from "@/hooks/useFeatures";
import { useOrganization } from "@/hooks/useOrganization";

export function CreateOrgOverrideModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { createOverride, isCreating } = useOverrides();
  const { features, fetchFeatures } = useFeatures();
  const { orgId } = useOrganization();

  const [featureSlug, setFeatureSlug] = useState<string>("");
  const [type, setType] = useState<
    "feature_enable" | "feature_disable" | "limit_increase"
  >("feature_enable");
  const [value, setValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      fetchFeatures();
      setValue("");
      setReason("");
      setExpiresAt("");
      setType("feature_enable");
    }
  }, [open, fetchFeatures]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !featureSlug) return;

    const success = await createOverride({
      organizationId: orgId,
      featureSlug,
      overrideType: type,
      value: type === "limit_increase" ? value : undefined,
      reason,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    });

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Organization Override</DialogTitle>
          <DialogDescription>
            Grant global permissions or limits to the entire organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Feature</Label>
            <Select value={featureSlug} onValueChange={setFeatureSlug}>
              <SelectTrigger>
                <SelectValue placeholder="Select Feature" />
              </SelectTrigger>
              <SelectContent>
                {features.map((f) => (
                  <SelectItem key={f.id} value={f.slug}>
                    {f.name} ({f.slug})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Override Type</Label>
            <RadioGroup value={type} onValueChange={(v: any) => setType(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feature_enable" id="org-enable" />
                <Label htmlFor="org-enable">Enable Feature</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feature_disable" id="org-disable" />
                <Label htmlFor="org-disable">Disable Feature</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limit_increase" id="org-limit" />
                <Label htmlFor="org-limit">Set Custom Limit</Label>
              </div>
            </RadioGroup>
          </div>

          {type === "limit_increase" && (
            <div className="space-y-2">
              <Label>Limit Value</Label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 500"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expires At (Optional)</Label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Organization-wide upgrade"
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
            <Button
              type="submit"
              disabled={isCreating || !orgId || !featureSlug}
            >
              {isCreating ? "Creating..." : "Create Override"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
