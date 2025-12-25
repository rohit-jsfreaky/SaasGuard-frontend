import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoles } from "@/hooks/useRoles";
import { useOrganization } from "@/hooks/useOrganization";
import { useEffect } from "react";

interface AssignRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingRoleIds: number[];
  onConfirm: (roleId: number) => Promise<boolean>;
}

export function AssignRoleModal({
  open,
  onOpenChange,
  existingRoleIds,
  onConfirm,
}: AssignRoleModalProps) {
  const { roles, fetchRoles } = useRoles();
  const { orgId } = useOrganization();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && orgId) {
      fetchRoles(orgId);
      setSelectedRoleId("");
    }
  }, [open, orgId, fetchRoles]);

  const availableRoles = roles.filter((r) => !existingRoleIds.includes(r.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) return;

    setIsSubmitting(true);
    const success = await onConfirm(parseInt(selectedRoleId, 10));
    setIsSubmitting(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
          <DialogDescription>Grant a new role to this user.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No available roles to assign.
                  </div>
                ) : (
                  availableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedRoleId}>
              {isSubmitting ? "Assigning..." : "Assign Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
