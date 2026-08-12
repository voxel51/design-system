import type { FC, HTMLAttributes } from "react";

import { Text, TextProps } from "@/components/Text";
import {
  bgColorClass,
  getColorCssVar,
  Orientation,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * The visual style used to render a {@link Divider}.
 *
 * - `Line` renders a solid 1px rule (the default).
 * - `Dot` renders a centered dot separator. When a `label` is present the dot
 *   is placed on either side of the label; otherwise a single centered dot is
 *   rendered.
 *
 * Defined locally to the Divider component so it does not pollute the shared
 * `@/types` enums.
 */
export enum DividerStyle {
  Line = "line",
  Dot = "dot",
}

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
  label?: string;
  /**
   * The visual style of the divider. Defaults to {@link DividerStyle.Line}.
   */
  dividerStyle?: DividerStyle;
  textProps?: TextProps;
}

interface LineProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
  dividerStyle?: DividerStyle;
}

interface DotProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
}

/**
 * A divider component used to separate content.
 *
 * @param orientation The {@link Orientation} of the divider. Defaults to a
 *   horizontal (row) rule. Use {@link Orientation.Column} for a vertical rule.
 * @param label The label to display in the middle of the divider. Labels are
 *   only supported for horizontal dividers — when a label is supplied together
 *   with {@link Orientation.Column} the label is dropped and a development
 *   warning is emitted via `console.warn`, since a vertical divider has no
 *   sensible place to render text.
 * @param dividerStyle The {@link DividerStyle} used to render the divider.
 *   Defaults to {@link DividerStyle.Line}. Use {@link DividerStyle.Dot} to
 *   render a dotted line, or — when no `label` is present — a single centered
 *   dot separator.
 * @param textProps Additional props forwarded to the label {@link Text}.
 * @param props Additional HTML properties to apply to the component.
 *
 */
export const Divider: FC<DividerProps> = ({
  orientation,
  label,
  dividerStyle = DividerStyle.Line,
  textProps,
  ...props
}) => {
  const isColumn = orientation === Orientation.Column;

  // A vertical divider has no sensible place to render a label, so we drop it
  // and warn during development rather than render an unsupported combination.
  let resolvedLabel = label;
  if (isColumn && label) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Divider: a `label` is not supported with `orientation=Orientation.Column`; the label will be ignored."
      );
    }
    resolvedLabel = undefined;
  }

  // When the dot style is used without a label, render a single centered dot
  // separator instead of two lines around a label.
  const isDotSeparator = dividerStyle === DividerStyle.Dot && !resolvedLabel;

  return (
    <div
      className={cn("flex items-center", isColumn ? "flex-col h-full" : "")}
      {...props}
    >
      {isDotSeparator ? (
        <>
          <Line
            orientation={orientation}
            dividerStyle={DividerStyle.Line}
            data-testid="divider-line-before"
          />
          <Dot orientation={orientation} data-testid="divider-dot" />
          <Line
            orientation={orientation}
            dividerStyle={DividerStyle.Line}
            data-testid="divider-line-after"
          />
        </>
      ) : (
        <>
          <Line
            orientation={orientation}
            dividerStyle={dividerStyle}
            data-testid="divider-line-before"
          />
          {resolvedLabel && (
            <>
              <Text
                color={TextColor.Primary}
                variant={TextVariant.Caption}
                className={cn(
                  isColumn ? "my-1" : "mx-2",
                  textColorClass(TextColor.Primary)
                )}
                data-testid="divider-label"
                {...textProps}
              >
                {resolvedLabel}
              </Text>
              <Line
                orientation={orientation}
                dividerStyle={dividerStyle}
                data-testid="divider-line-after"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

const Line: FC<LineProps> = ({
  orientation,
  dividerStyle = DividerStyle.Line,
  className,
  ...props
}) => {
  const isColumn = orientation === Orientation.Column;
  const isDotted = dividerStyle === DividerStyle.Dot;

  if (isDotted) {
    // Render a dotted line using a border so the dots size with the rule.
    return (
      <div
        className={cn(
          "border-dotted",
          `border-[var(${getColorCssVar(TextColor.Placeholder)})]`,
          isColumn ? "border-l h-full" : "border-t flex-1"
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        bgColorClass(TextColor.Placeholder),
        isColumn ? "w-px h-full" : "h-px flex-1",
        className
      )}
      {...props}
    />
  );
};

const Dot: FC<DotProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        bgColorClass(TextColor.Placeholder),
        "rounded-full w-1 h-1 shrink-0 mx-1",
        className
      )}
      {...props}
    />
  );
};

Divider.displayName = "Divider";
