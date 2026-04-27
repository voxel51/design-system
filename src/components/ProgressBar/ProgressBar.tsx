import type { FC, HTMLAttributes } from "react";

import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  ActionColor,
  BackgroundColor,
  bgColorClass,
  Radius,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export enum ProgressVariant {
  Primary = "primary",
  Success = "success",
  Danger = "danger",
  Warning = "warning",
  Info = "info",
}

export enum ProgressSize {
  Xs = "xs",
  Sm = "sm",
  Md = "md",
  Lg = "lg",
}

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Current value between 0 and 100.
   * Omit (or pass `undefined`) for indeterminate mode.
   */
  value?: number;
  /** Visual color variant of the filled bar. */
  variant?: ProgressVariant;
  /** Height of the bar. */
  size?: ProgressSize;
  /** Optional label displayed above the bar. */
  label?: string;
  /** When `true`, shows the numeric percentage to the right of the label. */
  showValue?: boolean;
}

const sizeStyles: Record<ProgressSize, string> = {
  [ProgressSize.Xs]: "h-0.5",
  [ProgressSize.Sm]: "h-1",
  [ProgressSize.Md]: "h-2",
  [ProgressSize.Lg]: "h-3",
};

const variantFillStyles: Record<ProgressVariant, string> = {
  [ProgressVariant.Primary]: bgColorClass(ActionColor.PrimaryDefault),
  [ProgressVariant.Success]: bgColorClass(ActionColor.SuccessDefault),
  [ProgressVariant.Danger]: bgColorClass(ActionColor.DangerDefault),
  [ProgressVariant.Warning]: "bg-[var(--color-content-status-review)]",
  [ProgressVariant.Info]: "bg-[var(--color-content-text-info)]",
};

/**
 * A linear progress bar supporting both determinate and indeterminate modes.
 *
 * @example
 * ```tsx
 * // Determinate
 * <ProgressBar value={65} label="Uploading" showValue />
 *
 * // Indeterminate
 * <ProgressBar label="Processing…" />
 * ```
 *
 * @param value Current progress (0–100). Omit for indeterminate mode.
 * @param variant Color variant of the filled portion. See {@link ProgressVariant}.
 * @param size Height of the bar. See {@link ProgressSize}.
 * @param label Optional text label rendered above the track.
 * @param showValue When `true`, displays the percentage value next to the label.
 * @param className `class` overrides for the root element.
 * @param props Additional HTML properties for the root element.
 */
export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  variant = ProgressVariant.Primary,
  size = ProgressSize.Md,
  label,
  showValue = false,
  className,
  ...props
}) => {
  const isIndeterminate = value === undefined;
  const clamped = isIndeterminate ? 0 : Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
              {label}
            </Text>
          )}
          {showValue && !isIndeterminate && (
            <Text variant={TextVariant.Sm} color={TextColor.Muted}>
              {clamped}%
            </Text>
          )}
        </div>
      )}

      {/* Track */}
      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn(
          "relative w-full overflow-hidden",
          bgColorClass(BackgroundColor.Muted),
          radiusStyles(Radius.Full),
          sizeStyles[size]
        )}
      >
        {isIndeterminate ? (
          <>
            {/* Inject keyframe once — React deduplicates identical style tags */}
            <style>{`
              @keyframes voodo-progress-indeterminate {
                0%   { transform: translateX(-100%); }
                100% { transform: translateX(350%); }
              }
            `}</style>
            <div
              className={cn(
                "absolute inset-y-0 w-1/3",
                radiusStyles(Radius.Full),
                variantFillStyles[variant]
              )}
              style={{
                animation:
                  "voodo-progress-indeterminate 1.4s ease-in-out infinite",
              }}
            />
          </>
        ) : (
          <div
            className={cn(
              "h-full transition-all duration-300 ease-out",
              radiusStyles(Radius.Full),
              variantFillStyles[variant]
            )}
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
    </div>
  );
};

ProgressBar.displayName = "ProgressBar";
