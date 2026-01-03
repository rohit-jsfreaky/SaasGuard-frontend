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
import type { Role } from "@/types/entities";
import { Badge } from "@/components/ui/badge";

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  assignedRoleIds: number[];
  onSubmit: (roleId: number) => Promise<boolean>;
}

export function AssignRoleModal({
  isOpen,
  onClose,
  roles,
  assignedRoleIds,
  onSubmit,
}: AssignRoleModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out already assigned roles
  const availableRoles = roles.filter((r) => !assignedRoleIds.includes(r.id));

  useEffect(() => {
    if (!isOpen) return;
    const firstAvailable = availableRoles[0]?.id;
    setSelectedRoleId(firstAvailable ? String(firstAvailable) : "");
  }, [isOpen, availableRoles]);

  const selectedRole = roles.find((r) => r.id === Number(selectedRoleId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoleId) return;

    setIsSubmitting(true);
    const success = await onSubmit(Number(selectedRoleId));
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
          <DialogDescription>
            Select a role to assign to this user.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {availableRoles.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-center">
              <p className="text-sm text-muted-foreground">
                All available roles have been assigned to this user.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select
                  value={selectedRoleId}
                  onValueChange={setSelectedRoleId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        <div className="flex items-center gap-2">
                          <span>{role.name}</span>
                          {role.permissionsCount !== undefined && (
                            <Badge variant="secondary" className="text-xs">
                              {role.permissionsCount} permissions
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRole && (
                <div className="rounded-md border p-3 bg-accent/50">
                  <p className="text-sm font-medium">{selectedRole.name}</p>
                  {selectedRole.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedRole.description}
                    </p>
                  )}
                  <Badge variant="outline" className="mt-2 font-mono text-xs">
                    {selectedRole.slug}
                  </Badge>
                </div>
              )}
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || !selectedRoleId || availableRoles.length === 0
              }
            >
              {isSubmitting ? "Assigning..." : "Assign Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
