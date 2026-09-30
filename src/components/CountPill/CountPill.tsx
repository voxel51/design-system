import type { FC, HTMLAttributes } from "react";

import { TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  Size,
  StatusColor,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export const CountPillTone = {
  Default: "default",
  Subtle: "subtle",
  Brand: "brand",
  Success: "success",
  Progress: "progress",
  Error: "error",
} as const;
export type CountPillTone =
  `${(typeof CountPillTone)[keyof typeof CountPillTone]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CountPillTone {
  export type Default = typeof CountPillTone.Default;
  export type Subtle = typeof CountPillTone.Subtle;
  export type Brand = typeof CountPillTone.Brand;
  export type Success = typeof CountPillTone.Success;
  export type Progress = typeof CountPillTone.Progress;
  export type Error = typeof CountPillTone.Error;
}

type CountPillSize = `${Extract<Size, Size.Sm | Size.Md | Size.Lg>}`;

export interface CountPillProps extends HTMLAttributes<HTMLSpanElement> {
  /** The number to show. */
  value: number | string;
  /** 14, 17 or 20px tall. */
  size?: CountPillSize;
  /** The surface: neutral, or one of the status fills. */
  tone?: CountPillTone;
}

// Figma CountPill: mono 11/16 in a 20×14 (Default) or 25×17 (Medium) pill,
// mono 12/16 in a 30×20 (Large) one. Wider counts grow from those minimums.
const sizeStyles: Record<CountPillSize, string> = {
  [Size.Sm]: cn("h-3.5 min-w-5 px-1", TEXT_STYLES[TextVariant.CodeSecondary]),
  [Size.Md]: cn(
    "h-[17px] min-w-[25px] px-1.5",
    TEXT_STYLES[TextVariant.CodeSecondary]
  ),
  [Size.Lg]: cn("h-5 min-w-[30px] px-2", TEXT_STYLES[TextVariant.CodePrimary]),
};

// Filled tones take white directly, as the filled buttons do: Figma binds
// text/primary, which goes dark in light mode on these fixed fills.
const toneStyles: Record<CountPillTone, string> = {
  [CountPillTone.Default]: cn(
    bgColorClass(BackgroundColor.Card),
    textColorClass(TextColor.Primary)
  ),
  [CountPillTone.Subtle]: cn(
    bgColorClass(BackgroundColor.Card),
    textColorClass(TextColor.Secondary)
  ),
  [CountPillTone.Brand]: cn(bgColorClass(StatusColor.ReviewBg), "text-white"),
  [CountPillTone.Success]: cn(
    bgColorClass(StatusColor.ApprovedBg),
    "text-white"
  ),
  [CountPillTone.Progress]: cn(
    bgColorClass(StatusColor.ProgressBg),
    "text-white"
  ),
  [CountPillTone.Error]: cn(bgColorClass(StatusColor.FailedBg), "text-white"),
};

/**
 * A small mono counter, for tallies beside a label or in a tab.
 *
 * @example
 * ```tsx
 * <CountPill value={4} tone={CountPillTone.Error} />
 * ```
 *
 * @param value The count.
 * @param size 14, 17 or 20px tall. See {@link Size}.
 * @param tone The surface. See {@link CountPillTone}.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const CountPill: FC<CountPillProps> = ({
  value,
  size = Size.Md,
  tone = CountPillTone.Default,
  className,
  ...props
}) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-full tabular-nums",
      sizeStyles[size],
      toneStyles[tone],
      className
    )}
    {...props}
  >
    {typeof value === "number" ? value.toLocaleString() : value}
  </span>
);

CountPill.displayName = "CountPill";
