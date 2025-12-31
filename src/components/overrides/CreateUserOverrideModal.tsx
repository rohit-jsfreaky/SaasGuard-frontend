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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOverridesModalStore } from "@/store/overrides-modal.store";
import { useOverridesStore } from "@/store/overrides.store";
import { useState, useEffect } from "react";
import type { Feature, OverrideType, User } from "@/types/entities";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateUserOverrideModalProps {
  features: Feature[];
  users: User[];
}

export function CreateUserOverrideModal({
  features,
  users,
}: CreateUserOverrideModalProps) {
  const { isOpen, type, closeModal } = useOverridesModalStore();
  const createUserOverride = useOverridesStore(
    (state) => state.createUserOverride
  );

  const [userId, setUserId] = useState<string>("");
  const [featureSlug, setFeatureSlug] = useState("");
  const [overrideType, setOverrideType] =
    useState<OverrideType>("feature_enable");
  const [value, setValue] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{
    user?: string;
    feature?: string;
    value?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = isOpen && type === "create-user";

  useEffect(() => {
    if (isModalOpen) {
      setUserId("");
      setFeatureSlug("");
      setOverrideType("feature_enable");
      setValue("");
      setExpiresAt(undefined);
      setReason("");
      setErrors({});
    }
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { user?: string; feature?: string; value?: string } = {};
    if (!userId) {
      newErrors.user = "Please select a user";
    }
    if (!featureSlug) {
      newErrors.feature = "Please select a feature";
    }
    if (
      overrideType === "limit_increase" &&
      (!value || isNaN(Number(value)) || Number(value) <= 0)
    ) {
      newErrors.value = "Please enter a valid positive number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const success = await createUserOverride({
      userId: Number(userId),
      featureSlug,
      overrideType,
      value: overrideType === "limit_increase" ? Number(value) : undefined,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
      reason: reason || undefined,
    });
    setIsSubmitting(false);

    if (success) {
      closeModal();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create User Override</DialogTitle>
          <DialogDescription>
            Create an override for a specific user.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>User</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger
                className={errors.user ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.firstName} {user.lastName} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.user && (
              <p className="text-sm text-destructive">{errors.user}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Feature</Label>
            <Select value={featureSlug} onValueChange={setFeatureSlug}>
              <SelectTrigger
                className={errors.feature ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select a feature" />
              </SelectTrigger>
              <SelectContent>
                {features.map((feature) => (
                  <SelectItem key={feature.id} value={feature.slug}>
                    {feature.name} ({feature.slug})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.feature && (
              <p className="text-sm text-destructive">{errors.feature}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Override Type</Label>
            <RadioGroup
              value={overrideType}
              onValueChange={(v) => setOverrideType(v as OverrideType)}
              className="grid gap-2"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="feature_enable" id="user-enable" />
                <Label htmlFor="user-enable" className="flex-1 cursor-pointer">
                  <div className="font-medium">Enable Feature</div>
                  <div className="text-xs text-muted-foreground">
                    Grant access to this feature
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="feature_disable" id="user-disable" />
                <Label htmlFor="user-disable" className="flex-1 cursor-pointer">
                  <div className="font-medium">Disable Feature</div>
                  <div className="text-xs text-muted-foreground">
                    Revoke access to this feature
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="limit_increase" id="user-limit" />
                <Label htmlFor="user-limit" className="flex-1 cursor-pointer">
                  <div className="font-medium">Increase Limit</div>
                  <div className="text-xs text-muted-foreground">
                    Increase usage limit for this feature
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {overrideType === "limit_increase" && (
            <div className="grid gap-2">
              <Label htmlFor="user-value">New Limit Value</Label>
              <Input
                id="user-value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 10000"
                min={1}
                className={errors.value ? "border-destructive" : ""}
              />
              {errors.value && (
                <p className="text-sm text-destructive">{errors.value}</p>
              )}
            </div>
          )}

          <div className="grid gap-2">
            <Label>Expiration Date (Optional)</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !expiresAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiresAt ? format(expiresAt, "PPP") : "Never (Permanent)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiresAt}
                    onSelect={setExpiresAt}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {expiresAt && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpiresAt(undefined)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-reason">Reason (Optional)</Label>
            <Textarea
              id="user-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Temporary access for special project"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Override"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
