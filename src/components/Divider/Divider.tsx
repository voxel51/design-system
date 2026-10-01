import type { FC, HTMLAttributes } from "react";

import { Text, TextProps } from "@/components/Text";
import {
  BorderColor,
  borderColorClass,
  Orientation,
  TextColor,
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
export const DividerStyle = {
  Line: "line",
  Dot: "dot",
} as const;
export type DividerStyle =
  `${(typeof DividerStyle)[keyof typeof DividerStyle]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DividerStyle {
  export type Line = typeof DividerStyle.Line;
  export type Dot = typeof DividerStyle.Dot;
}

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
  label?: string;
  /**
   * The visual style of the divider. Defaults to `"line"`.
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
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="or" />
 * <Stack orientation="row" align="center">
 *   <Text>Left</Text>
 *   <Divider orientation="col" />
 *   <Text>Right</Text>
 * </Stack>
 * ```
 *
 * @param orientation The {@link Orientation} of the divider. Defaults to a
 *   horizontal (`"row"`) rule. Use `"col"` for a vertical rule.
 * @param label The label to display in the middle of the divider. Labels are
 *   only supported for horizontal dividers: with `"col"` the label is dropped
 *   and a development warning is emitted via `console.warn`, since a vertical
 *   divider has no sensible place to render text.
 * @param dividerStyle The {@link DividerStyle} used to render the divider.
 *   Defaults to `"line"`. Use `"dot"` to render a dotted line, or, when no
 *   `label` is present, a single centered dot separator.
 * @param textProps Additional props forwarded to the label {@link Text}.
 * @param props Additional HTML properties to apply to the component.
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
                className={isColumn ? "my-1" : "mx-2"}
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
          // Figma Divider: border/subtle line, border/default dot. Use the
          // static class rather than a runtime-built `border-[var(...)]`,
          // which Tailwind's scanner cannot see and the safelist does not
          // cover without a state prefix.
          "border-dotted",
          borderColorClass(BorderColor.Subtle),
          isColumn ? "border-l h-full" : "border-t flex-1"
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "bg-content-border-subtle",
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
        "bg-content-border-default",
        "rounded-full size-[3px] shrink-0 mx-1",
        className
      )}
      {...props}
    />
  );
};

Divider.displayName = "Divider";
