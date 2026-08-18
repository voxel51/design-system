import { toast as sonnerToast } from "sonner";
import { Check, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Bold notification toasts — high-emphasis, fully-colored confirmation toasts
 * for the design system. Use `notify.success` for positive confirmations
 * (green), `notify.error` for failures (red), `notify.info` (blue), and
 * `notify.warning` (orange). An optional action renders a trailing button.
 *
 *   notify.success("Added to collection")
 *   notify.error("Couldn't delete collection", { action: { label: "Try again", onClick } })
 */

type ToastTone = "success" | "error" | "info" | "warning";

interface NotifyOptions {
  action?: { label: string; onClick: () => void };
  duration?: number;
}

const toneConfig: Record<
  ToastTone,
  { bg: string; Icon: typeof Check }
> = {
  success: { bg: "bg-[hsl(var(--toast-success))]", Icon: Check },
  error: { bg: "bg-[hsl(var(--toast-failure))]", Icon: AlertCircle },
  info: { bg: "bg-[hsl(var(--toast-info))]", Icon: Info },
  warning: { bg: "bg-[hsl(var(--toast-warning))]", Icon: AlertTriangle },

};

function BoldToast({
  tone,
  message,
  action,
  toastId,
}: {
  tone: ToastTone;
  message: string;
  action?: NotifyOptions["action"];
  toastId: string | number;
}) {
  const { bg, Icon } = toneConfig[tone];
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg pl-4 pr-2.5 py-3 shadow-lg w-full min-w-[300px] text-white",
        bg,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
      <span className="flex-1 text-body font-medium leading-snug">{message}</span>
      {action && (
        <button
          type="button"
          onClick={() => {
            action.onClick();
            sonnerToast.dismiss(toastId);
          }}
          className="shrink-0 rounded-md px-2 py-1 text-body font-semibold text-white/95 hover:bg-white/15 transition-colors"
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => sonnerToast.dismiss(toastId)}
        className="shrink-0 rounded-md p-1 text-white/90 hover:bg-white/15 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function show(tone: ToastTone, message: string, opts?: NotifyOptions) {
  return sonnerToast.custom(
    (id) => (
      <BoldToast tone={tone} message={message} action={opts?.action} toastId={id} />
    ),
    { duration: opts?.duration ?? 4000 },
  );
}

export const notify = {
  success: (message: string, opts?: NotifyOptions) => show("success", message, opts),
  error: (message: string, opts?: NotifyOptions) => show("error", message, opts),
  info: (message: string, opts?: NotifyOptions) => show("info", message, opts),
  warning: (message: string, opts?: NotifyOptions) => show("warning", message, opts),
};
