import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Check, Loader2, AlertCircle, WifiOff, RotateCcw, Undo2, X } from "lucide-react";
import { Button } from "./button";
import { reportSaveState } from "../../lib/saveStatusStore";

/**
 * StatusIndicator — fixed-position "activity toast" for inline background work.
 * Use for processing/success/error feedback on long-running actions (run launch,
 * pause/resume, autosave). Matches the Annotation activity-toast styling.
 */

export type StatusState = "idle" | "processing" | "success" | "error" | "offline";

interface StatusAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
  icon?: React.ReactNode;
}

interface StatusIndicatorProps {
  state: StatusState;
  processingText?: string;
  successText?: string;
  errorTitle?: string;
  errorDescription?: string;
  offlineTitle?: string;
  offlineDescription?: string;
  actions?: StatusAction[];
  onDismiss?: () => void;
  autoHideDelay?: number;
  position?: "bottom-left" | "bottom-right" | "bottom-center";
  className?: string;
  /**
   * Route processing/success into the global save dot instead of showing the
   * compact toast. Errors/offline still surface as the toast. Use on annotation
   * editors so rapid saves don't spam toasts.
   */
  reportToSaveDot?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  state,
  processingText = "Saving…",
  successText = "Saved",
  errorTitle = "Something went wrong",
  errorDescription = "Your changes couldn't be saved. Please try again.",
  offlineTitle = "You're offline",
  offlineDescription = "Changes will be saved when you reconnect.",
  actions = [],
  onDismiss,
  autoHideDelay = 2000,
  position = "bottom-right",
  className,
  reportToSaveDot = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Mirror processing/success/error into the global save dot when opted in.
  useEffect(() => {
    if (!reportToSaveDot) return;
    if (state === "processing") reportSaveState("saving");
    else if (state === "success") reportSaveState("saved");
    else if (state === "error") reportSaveState("error");
  }, [state, reportToSaveDot]);

  useEffect(() => {
    if (state === "idle") {
      setVisible(false);
      setExpanded(false);
      return;
    }

    // When feeding the save dot, the activity toast is fully replaced by the
    // dot — never show it (saving/saved/error all read from the header dot).
    if (reportToSaveDot) {
      setVisible(false);
      setExpanded(false);
      return;
    }

    setVisible(true);
    setExpanded(state === "offline");

    if (state === "success") {
      const timer = setTimeout(() => setVisible(false), autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [state, autoHideDelay, reportToSaveDot]);

  const positionClasses = {
    "bottom-left": "left-4 bottom-4",
    "bottom-right": "right-4 bottom-4",
    "bottom-center": "left-1/2 -translate-x-1/2 bottom-4",
  };

  const renderIcon = () => {
    switch (state) {
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case "success":
        return <Check className="h-4 w-4 text-status-success" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-status-failed" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-icon-decorative" />;
      default:
        return null;
    }
  };

  const renderCompactContent = () => {
    switch (state) {
      case "processing":
        return <span className="text-sm text-muted-foreground">{processingText}</span>;
      case "success":
        return <span className="text-sm text-status-success">{successText}</span>;
      case "error":
        return <span className="text-sm text-status-failed">{errorTitle}</span>;
      default:
        return null;
    }
  };

  const renderExpandedContent = () => {
    const title = state === "offline" ? offlineTitle : errorTitle;
    const description = state === "offline" ? offlineDescription : errorDescription;

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{renderIcon()}</div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-sm font-medium text-foreground">{title}</span>
            <span className="text-xs text-muted-foreground leading-relaxed">{description}</span>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors -mt-0.5 -mr-0.5"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {actions.length > 0 && (
          <div className="flex items-center gap-2 ml-7">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size="sm"
                onClick={action.onClick}
                className={cn(
                  "h-8 text-xs font-medium",
                  action.variant === "default" && "bg-primary hover:bg-primary/90 text-primary-foreground",
                  action.variant === "outline" && "bg-transparent border-border-strong text-foreground hover:bg-card-2",
                )}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-300 ease-out",
        positionClasses[position],
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className,
      )}
    >
      <div
        className={cn(
          "bg-card border border-border rounded-lg shadow-lg transition-all duration-300 ease-out",
          expanded ? "p-4 min-w-[320px]" : "px-3 py-2",
        )}
      >
        {expanded ? (
          renderExpandedContent()
        ) : (
            <div className="flex items-center gap-2">
            {renderIcon()}
            {renderCompactContent()}
            {state === "error" && onDismiss && (
              <button
                onClick={onDismiss}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                  <X size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/** Demo / convenience hook for driving state transitions. */
export const useStatusIndicator = () => {
  const [state, setState] = useState<StatusState>("idle");

  return {
    state,
    startProcessing: () => setState("processing"),
    setSuccess: () => setState("success"),
    setError: () => setState("error"),
    setOffline: () => setState("offline"),
    reset: () => setState("idle"),
  };
};

export const getRetryAction = (onRetry: () => void): StatusAction => ({
  label: "Retry",
  onClick: onRetry,
  variant: "default",
  icon: <RotateCcw className="h-3 w-3 mr-1" />,
});

export const getRevertAction = (onRevert: () => void): StatusAction => ({
  label: "Revert",
  onClick: onRevert,
  variant: "outline",
  icon: <Undo2 className="h-3 w-3 mr-1" />,
});
