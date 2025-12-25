/**
 * Notification Center Component
 * Displays toast notifications from the UI store
 */

import { X, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import {
  useUIStore,
  type Notification,
  type NotificationType,
} from "@/store/ui.store";
import { cn } from "@/lib/utils";

/**
 * Icon map for notification types
 */
const iconMap: Record<NotificationType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

/**
 * Style map for notification types
 */
const styleMap: Record<NotificationType, string> = {
  success:
    "bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400",
  error: "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400",
  info: "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400",
  warning:
    "bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400",
};

/**
 * Single notification item
 */
function NotificationItem({ notification }: { notification: Notification }) {
  const removeNotification = useUIStore((state) => state.removeNotification);
  const Icon = iconMap[notification.type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm",
        "animate-in slide-in-from-right-5 fade-in duration-300",
        styleMap[notification.type]
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{notification.title}</p>
        {notification.message && (
          <p className="text-xs opacity-80 mt-0.5">{notification.message}</p>
        )}
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Notification Center component
 */
export function NotificationCenter() {
  const notifications = useUIStore((state) => state.notifications);

  // Don't render if no notifications
  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationItem notification={notification} />
        </div>
      ))}
    </div>
  );
}

export default NotificationCenter;
