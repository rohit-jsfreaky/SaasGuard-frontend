import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Shield } from "lucide-react";
import { useSettingsStore } from "@/store/settings.store";
import type { OrgMember } from "@/services/settings.service";

interface MakeAdminConfirmProps {
  member: OrgMember | null;
  organizationId: number;
  onClose: () => void;
}

export function MakeAdminConfirm({
  member,
  organizationId,
  onClose,
}: MakeAdminConfirmProps) {
  const { makeAdmin } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!member) return;

    setIsLoading(true);
    await makeAdmin(organizationId, member.id);
    setIsLoading(false);
    onClose();
  };

  return (
    <AlertDialog open={!!member} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Make User Admin
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to make{" "}
            <span className="font-medium text-foreground">{member?.email}</span>{" "}
            an admin? They will have full access to manage this organization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Make Admin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
