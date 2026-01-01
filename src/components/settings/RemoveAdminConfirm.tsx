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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldOff, AlertTriangle } from "lucide-react";
import { useSettingsStore } from "@/store/settings.store";
import type { OrgAdmin } from "@/services/settings.service";

interface RemoveAdminConfirmProps {
  admin: OrgAdmin | null;
  organizationId: number;
  currentUserId?: number;
  onClose: () => void;
}

export function RemoveAdminConfirm({
  admin,
  organizationId,
  currentUserId,
  onClose,
}: RemoveAdminConfirmProps) {
  const { removeAdmin } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);

  const isSelf = admin?.id === currentUserId;

  const handleConfirm = async () => {
    if (!admin) return;

    setIsLoading(true);
    await removeAdmin(organizationId, admin.id);
    setIsLoading(false);
    onClose();
  };

  return (
    <AlertDialog open={!!admin} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <ShieldOff className="h-5 w-5" />
            Remove Admin
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove admin privileges from{" "}
            <span className="font-medium text-foreground">{admin?.email}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isSelf && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> You are about to remove your own admin
              access. You will no longer be able to manage this organization.
            </AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remove Admin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
