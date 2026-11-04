import type { FC, HTMLAttributes, ReactNode } from "react";

import { Text } from "@/components/Text";
import { TextColor, textColorClass, TextVariant } from "@/types";
import { cn } from "@/util/classes";

export const AlertTone = {
  Failure: "failure",
  Warning: "warning",
  Info: "info",
  Success: "success",
} as const;
export type AlertTone = `${(typeof AlertTone)[keyof typeof AlertTone]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AlertTone {
  export type Failure = typeof AlertTone.Failure;
  export type Warning = typeof AlertTone.Warning;
  export type Info = typeof AlertTone.Info;
  export type Success = typeof AlertTone.Success;
}

export interface AlertProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  tone?: AlertTone;
  action?: ReactNode;
  multiline?: boolean;
}

// Literal class names so Tailwind's scanner sees them
const toneStyles: Record<AlertTone, { surface: string; text: TextColor }> = {
  [AlertTone.Failure]: {
    surface: "bg-content-bg-failure/10",
    text: TextColor.Failure,
  },
  [AlertTone.Warning]: {
    surface: "bg-content-bg-warning/10",
    text: TextColor.Warning,
  },
  [AlertTone.Info]: {
    surface: "bg-content-bg-info/10",
    text: TextColor.Info,
  },
  [AlertTone.Success]: {
    surface: "bg-content-bg-success/10",
    text: TextColor.Success,
  },
};

const toneControls = cn(
  "flex shrink-0",
  "[&_:is(a,button)]:text-current [&_:is(a,button)_*]:text-current",
  "[&_:is(a,button):hover]:text-current [&_:is(a,button):hover]:bg-current/10"
);

/**
 * A single-line inline message on a tinted surface, with an optional action,
 * for a state the page should call out, such as why a run failed.
 *
 * @example
 * ```tsx
 * <Alert tone="failure" action={<TextAction size="sm">View errors</TextAction>}>
 *   PackageError: umap-learn is not installed
 * </Alert>
 * ```
 *
 * @param tone The {@link AlertTone}: `"failure"` (default), `"warning"`, `"info"` or `"success"`.
 * @param action Control shown at the end of the row, such as a {@link TextAction}; it takes the tone's text colour.
 * @param multiline Wraps a long message over several lines instead of cutting it with an ellipsis.
 * @param className `class` overrides to apply to the component.
 * @param children The message; cut with an ellipsis when it does not fit unless `multiline`.
 * @param props Additional HTML properties to apply to the component.
 */
export const Alert: FC<AlertProps> = ({
  tone = AlertTone.Failure,
  action,
  multiline,
  className,
  children,
  ...props
}) => {
  const { surface, text } = toneStyles[tone];
  return (
    <div
      role={tone === AlertTone.Failure ? "alert" : "status"}
      className={cn(
        "flex items-center gap-4 rounded-md px-3 py-2",
        surface,
        className
      )}
      {...props}
    >
      <Text
        variant={TextVariant.BodySecondary}
        color={text}
        truncate={!multiline}
        className="min-w-0 flex-1"
      >
        {children}
      </Text>
      {action && (
        <span className={cn(toneControls, textColorClass(text))}>{action}</span>
      )}
    </div>
  );
};

Alert.displayName = "Alert";
