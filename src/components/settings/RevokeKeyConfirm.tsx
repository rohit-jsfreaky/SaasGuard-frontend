import { AlertTriangle, Ban, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RevokeKeyConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyName: string;
  keyPrefix: string;
  onConfirm: () => void;
  action: "revoke" | "delete";
  isLoading?: boolean;
}

export function RevokeKeyConfirm({
  open,
  onOpenChange,
  keyName,
  keyPrefix,
  onConfirm,
  action,
  isLoading = false,
}: RevokeKeyConfirmProps) {
  const isRevoke = action === "revoke";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isRevoke ? (
              <Ban className="h-5 w-5 text-amber-500" />
            ) : (
              <Trash2 className="h-5 w-5 text-destructive" />
            )}
            {isRevoke ? "Revoke" : "Delete"} API Key
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to {action} the API key{" "}
              <strong>"{keyName}"</strong>?
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Key prefix:</span>
              <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                {keyPrefix}...
              </code>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border bg-amber-500/10 border-amber-500/20 p-4 my-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              {isRevoke ? (
                <p>
                  Revoking this key will immediately stop all applications using
                  it from accessing the API. The key will be marked as inactive
                  but can still be viewed in your key list.
                </p>
              ) : (
                <p>
                  Deleting this key will permanently remove it from your
                  organization. This action cannot be undone.
                </p>
              )}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={isRevoke ? "default" : "destructive"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRevoke ? "Revoking..." : "Deleting..."}
              </>
            ) : isRevoke ? (
              "Revoke Key"
            ) : (
              "Delete Key"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
