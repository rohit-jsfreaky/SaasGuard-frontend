import {
  AlertDialog as UIAlertDialog,
  AlertDialogAction,
  AlertDialogContent as UIAlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type AlertType = "info" | "success" | "warning" | "error";

interface AlertDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  type?: AlertType;
  actionText?: string;
  onAction?: () => void;
}

const icons = {
  info: <Info className="h-6 w-6 text-blue-500" />,
  success: <CheckCircle className="h-6 w-6 text-green-500" />,
  warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
  error: <XCircle className="h-6 w-6 text-red-500" />,
};

export function AlertDialog({
  isOpen,
  onOpenChange,
  title,
  message,
  type = "info",
  actionText = "OK",
  onAction,
}: AlertDialogProps) {
  return (
    <UIAlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <UIAlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {icons[type]}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              onAction?.();
              onOpenChange(false);
            }}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </UIAlertDialogContent>
    </UIAlertDialog>
  );
}
