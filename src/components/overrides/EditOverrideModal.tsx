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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOverridesModalStore } from "@/store/overrides-modal.store";
import { useOverridesStore } from "@/store/overrides.store";
import { useState, useEffect } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function EditOverrideModal() {
  const { isOpen, type, data, closeModal } = useOverridesModalStore();
  const updateOverride = useOverridesStore((state) => state.updateOverride);

  const [value, setValue] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{ value?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = isOpen && type === "edit" && !!data;

  useEffect(() => {
    if (isModalOpen && data) {
      setValue(data.value?.toString() || "");
      setExpiresAt(data.expiresAt ? new Date(data.expiresAt) : undefined);
      setReason(data.reason || "");
      setErrors({});
    }
  }, [isModalOpen, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    const newErrors: { value?: string } = {};
    if (
      data.overrideType === "limit_increase" &&
      (!value || isNaN(Number(value)) || Number(value) <= 0)
    ) {
      newErrors.value = "Please enter a valid positive number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const success = await updateOverride(data.id, {
      value: data.overrideType === "limit_increase" ? Number(value) : null,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
      reason: reason || undefined,
    });
    setIsSubmitting(false);

    if (success) {
      closeModal();
    }
  };

  const getOverrideTypeLabel = (type: string) => {
    switch (type) {
      case "feature_enable":
        return "Enable Feature";
      case "feature_disable":
        return "Disable Feature";
      case "limit_increase":
        return "Limit Increase";
      default:
        return type;
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Override</DialogTitle>
          <DialogDescription>
            Update override settings. Feature and type cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Feature</Label>
            <Badge variant="outline" className="w-fit font-mono">
              {data?.featureSlug}
            </Badge>
          </div>

          <div className="grid gap-2">
            <Label>Override Type</Label>
            <Badge variant="secondary" className="w-fit">
              {data ? getOverrideTypeLabel(data.overrideType) : ""}
            </Badge>
          </div>

          {data?.overrideType === "limit_increase" && (
            <div className="grid gap-2">
              <Label htmlFor="edit-value">Limit Value</Label>
              <Input
                id="edit-value"
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
            <Label>Expiration Date</Label>
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
            <Label htmlFor="edit-reason">Reason</Label>
            <Textarea
              id="edit-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Update the reason for this override"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
