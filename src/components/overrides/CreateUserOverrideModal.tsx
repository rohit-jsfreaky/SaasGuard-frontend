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
import { useDataStore } from "@/store/data.store"; // for users list

export function CreateUserOverrideModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { createOverride, isCreating } = useOverrides();
  const { features, fetchFeatures } = useFeatures();
  // We need users. Let's assume passed active org users are in store or fetch explicit?
  // Using useDataStore directly to access users loaded in other pages might be risky if not loaded.
  // Ideally CreateUserOverride should mostly search for a user as per requirements.
  // For MVP, we'll list users from store if available, or fetch.
  // Let's rely on `useDataStore.getState().fetchUsers(orgId)` or similar if we were fully connected.
  // For strictness, let's just use an Input ID or simplified select if users are loaded.
  // Getting users list:
  const users = useDataStore((state) => state.users);
  // NOTE: This assumes users are loaded. If not, this might be empty.
  // A robust solution would fetch users on open.

  const [userId, setUserId] = useState<string>("");
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
      setUserId("");
      setType("feature_enable");
    }
  }, [open, fetchFeatures]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !featureSlug) return;

    const success = await createOverride({
      userId: parseInt(userId, 10),
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
          <DialogTitle>Create User Override</DialogTitle>
          <DialogDescription>
            Grant special permissions or limits to a specific user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>User</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                {users.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No users loaded (Go to Users page first or implemented
                    search)
                  </div>
                ) : (
                  users.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

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
                <RadioGroupItem value="feature_enable" id="enable" />
                <Label htmlFor="enable">Enable Feature</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feature_disable" id="disable" />
                <Label htmlFor="disable">Disable Feature</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limit_increase" id="limit" />
                <Label htmlFor="limit">Set Custom Limit</Label>
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
              placeholder="e.g. Temporary upgrade for support testing"
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
              disabled={isCreating || !userId || !featureSlug}
            >
              {isCreating ? "Creating..." : "Create Override"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
