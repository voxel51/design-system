import { ElementState, withElementState } from "@/types/element";

/**
 * Color tokens as enums — GENERATED from Figma's variable export by
 * kb/eng/projects/design-system-tokens/tools/build_color_types.py.
 * Do not edit by hand; re-run the generator instead.
 *
 * Enum values are the Figma variable names, so they line up 1:1 with the
 * CSS custom properties emitted from colors.ts.
 */

export const BackgroundColor = {
  Transparent: "bg-transparent",
  Accent: "bg-accent",
  Background: "bg-background",
  Card: "bg-card",
  CardElevated: "bg-card-elevated",
  CardNested: "bg-card-nested",
  Failure: "bg-failure",
  Info: "bg-info",
  Muted: "bg-muted",
  Popover: "bg-popover",
  Primary: "bg-primary",
  Secondary: "bg-secondary",
  Selected: "bg-selected",
  Success: "bg-success",
  Warning: "bg-warning",
} as const;
export type BackgroundColor =
  `${(typeof BackgroundColor)[keyof typeof BackgroundColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BackgroundColor {
  export type Transparent = typeof BackgroundColor.Transparent;
  export type Accent = typeof BackgroundColor.Accent;
  export type Background = typeof BackgroundColor.Background;
  export type Card = typeof BackgroundColor.Card;
  export type CardElevated = typeof BackgroundColor.CardElevated;
  export type CardNested = typeof BackgroundColor.CardNested;
  export type Failure = typeof BackgroundColor.Failure;
  export type Info = typeof BackgroundColor.Info;
  export type Muted = typeof BackgroundColor.Muted;
  export type Popover = typeof BackgroundColor.Popover;
  export type Primary = typeof BackgroundColor.Primary;
  export type Secondary = typeof BackgroundColor.Secondary;
  export type Selected = typeof BackgroundColor.Selected;
  export type Success = typeof BackgroundColor.Success;
  export type Warning = typeof BackgroundColor.Warning;
}

export const BorderColor = {
  Active: "border-active",
  Default: "border-default",
  Disabled: "border-disabled",
  Error: "border-error",
  Focus: "border-focus",
  Hover: "border-hover",
  Input: "border-input",
  InputFocus: "border-input-focus",
  InputHover: "border-input-hover",
  Strong: "border-strong",
  Subtle: "border-subtle",
  Success: "border-success",
  Warning: "border-warning",
  CardElevated: "bg-card-elevated",
} as const;
export type BorderColor = `${(typeof BorderColor)[keyof typeof BorderColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BorderColor {
  export type Active = typeof BorderColor.Active;
  export type Default = typeof BorderColor.Default;
  export type Disabled = typeof BorderColor.Disabled;
  export type Error = typeof BorderColor.Error;
  export type Focus = typeof BorderColor.Focus;
  export type Hover = typeof BorderColor.Hover;
  export type Input = typeof BorderColor.Input;
  export type InputFocus = typeof BorderColor.InputFocus;
  export type InputHover = typeof BorderColor.InputHover;
  export type Strong = typeof BorderColor.Strong;
  export type Subtle = typeof BorderColor.Subtle;
  export type Success = typeof BorderColor.Success;
  export type Warning = typeof BorderColor.Warning;
  export type CardElevated = typeof BorderColor.CardElevated;
}

export const CodeColor = {
  Bg: "code-bg",
  Border: "code-border",
  Text: "code-text",
} as const;
export type CodeColor = `${(typeof CodeColor)[keyof typeof CodeColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CodeColor {
  export type Bg = typeof CodeColor.Bg;
  export type Border = typeof CodeColor.Border;
  export type Text = typeof CodeColor.Text;
}

export const FocusColor = {
  Ring: "focus-ring",
} as const;
export type FocusColor = `${(typeof FocusColor)[keyof typeof FocusColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FocusColor {
  export type Ring = typeof FocusColor.Ring;
}

export const IconColor = {
  Brand: "icon-brand",
  Dark: "icon-dark",
  Decorative: "icon-decorative",
  Default: "icon-default",
  Disabled: "icon-disabled",
  Emphasis: "icon-emphasis",
  Failure: "icon-failure",
  Info: "icon-info",
  Muted: "icon-muted",
  Subtle: "icon-subtle",
  Success: "icon-success",
  Warning: "icon-warning",
} as const;
export type IconColor = `${(typeof IconColor)[keyof typeof IconColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IconColor {
  export type Brand = typeof IconColor.Brand;
  export type Dark = typeof IconColor.Dark;
  export type Decorative = typeof IconColor.Decorative;
  export type Default = typeof IconColor.Default;
  export type Disabled = typeof IconColor.Disabled;
  export type Emphasis = typeof IconColor.Emphasis;
  export type Failure = typeof IconColor.Failure;
  export type Info = typeof IconColor.Info;
  export type Muted = typeof IconColor.Muted;
  export type Subtle = typeof IconColor.Subtle;
  export type Success = typeof IconColor.Success;
  export type Warning = typeof IconColor.Warning;
}

export const InteractiveColor = {
  DangerDefault: "interactive-danger-default",
  DangerHover: "interactive-danger-hover",
  DangerPressed: "interactive-danger-pressed",
  ExpressiveDefaultEnd: "interactive-expressive-default-end",
  ExpressiveDefaultMid: "interactive-expressive-default-mid",
  ExpressiveDefaultStart: "interactive-expressive-default-start",
  ExpressiveHoverEnd: "interactive-expressive-hover-end",
  ExpressiveHoverMid: "interactive-expressive-hover-mid",
  ExpressiveHoverStart: "interactive-expressive-hover-start",
  ExpressivePressedEnd: "interactive-expressive-pressed-end",
  ExpressivePressedMid: "interactive-expressive-pressed-mid",
  ExpressivePressedStart: "interactive-expressive-pressed-start",
  PrimaryDefault: "interactive-primary-default",
  PrimaryHover: "interactive-primary-hover",
  PrimaryPressed: "interactive-primary-pressed",
  SecondaryDefault: "interactive-secondary-default",
  SecondaryHover: "interactive-secondary-hover",
  SecondaryPressed: "interactive-secondary-pressed",
  SuccessDefault: "interactive-success-default",
  SuccessHover: "interactive-success-hover",
  SuccessPressed: "interactive-success-pressed",
} as const;
export type InteractiveColor =
  `${(typeof InteractiveColor)[keyof typeof InteractiveColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace InteractiveColor {
  export type DangerDefault = typeof InteractiveColor.DangerDefault;
  export type DangerHover = typeof InteractiveColor.DangerHover;
  export type DangerPressed = typeof InteractiveColor.DangerPressed;
  export type ExpressiveDefaultEnd =
    typeof InteractiveColor.ExpressiveDefaultEnd;
  export type ExpressiveDefaultMid =
    typeof InteractiveColor.ExpressiveDefaultMid;
  export type ExpressiveDefaultStart =
    typeof InteractiveColor.ExpressiveDefaultStart;
  export type ExpressiveHoverEnd = typeof InteractiveColor.ExpressiveHoverEnd;
  export type ExpressiveHoverMid = typeof InteractiveColor.ExpressiveHoverMid;
  export type ExpressiveHoverStart =
    typeof InteractiveColor.ExpressiveHoverStart;
  export type ExpressivePressedEnd =
    typeof InteractiveColor.ExpressivePressedEnd;
  export type ExpressivePressedMid =
    typeof InteractiveColor.ExpressivePressedMid;
  export type ExpressivePressedStart =
    typeof InteractiveColor.ExpressivePressedStart;
  export type PrimaryDefault = typeof InteractiveColor.PrimaryDefault;
  export type PrimaryHover = typeof InteractiveColor.PrimaryHover;
  export type PrimaryPressed = typeof InteractiveColor.PrimaryPressed;
  export type SecondaryDefault = typeof InteractiveColor.SecondaryDefault;
  export type SecondaryHover = typeof InteractiveColor.SecondaryHover;
  export type SecondaryPressed = typeof InteractiveColor.SecondaryPressed;
  export type SuccessDefault = typeof InteractiveColor.SuccessDefault;
  export type SuccessHover = typeof InteractiveColor.SuccessHover;
  export type SuccessPressed = typeof InteractiveColor.SuccessPressed;
}

export const LinkColor = {
  Default: "link-default",
  Hover: "link-hover",
  Visited: "link-visited",
} as const;
export type LinkColor = `${(typeof LinkColor)[keyof typeof LinkColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LinkColor {
  export type Default = typeof LinkColor.Default;
  export type Hover = typeof LinkColor.Hover;
  export type Visited = typeof LinkColor.Visited;
}

export const ScrimColor = {
  Default: "scrim-default",
  Heavy: "scrim-heavy",
  Light: "scrim-light",
} as const;
export type ScrimColor = `${(typeof ScrimColor)[keyof typeof ScrimColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ScrimColor {
  export type Default = typeof ScrimColor.Default;
  export type Heavy = typeof ScrimColor.Heavy;
  export type Light = typeof ScrimColor.Light;
}

export const ScrollbarColor = {
  Thumb: "scrollbar-thumb",
  ThumbHover: "scrollbar-thumb-hover",
  Track: "scrollbar-track",
} as const;
export type ScrollbarColor =
  `${(typeof ScrollbarColor)[keyof typeof ScrollbarColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ScrollbarColor {
  export type Thumb = typeof ScrollbarColor.Thumb;
  export type ThumbHover = typeof ScrollbarColor.ThumbHover;
  export type Track = typeof ScrollbarColor.Track;
}

export const SelectionColor = {
  Bg: "selection-bg",
  Text: "selection-text",
} as const;
export type SelectionColor =
  `${(typeof SelectionColor)[keyof typeof SelectionColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SelectionColor {
  export type Bg = typeof SelectionColor.Bg;
  export type Text = typeof SelectionColor.Text;
}

export const SkeletonColor = {
  Base: "skeleton-base",
  Shimmer: "skeleton-shimmer",
} as const;
export type SkeletonColor =
  `${(typeof SkeletonColor)[keyof typeof SkeletonColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SkeletonColor {
  export type Base = typeof SkeletonColor.Base;
  export type Shimmer = typeof SkeletonColor.Shimmer;
}

export const StatusColor = {
  ApprovedBg: "status-approved-bg",
  ApprovedText: "status-approved-text",
  DraftBg: "status-draft-bg",
  DraftText: "status-draft-text",
  FailedBg: "status-failed-bg",
  FailedText: "status-failed-text",
  ProgressBg: "status-progress-bg",
  ProgressText: "status-progress-text",
  ReviewBg: "status-review-bg",
  ReviewText: "status-review-text",
} as const;
export type StatusColor = `${(typeof StatusColor)[keyof typeof StatusColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StatusColor {
  export type ApprovedBg = typeof StatusColor.ApprovedBg;
  export type ApprovedText = typeof StatusColor.ApprovedText;
  export type DraftBg = typeof StatusColor.DraftBg;
  export type DraftText = typeof StatusColor.DraftText;
  export type FailedBg = typeof StatusColor.FailedBg;
  export type FailedText = typeof StatusColor.FailedText;
  export type ProgressBg = typeof StatusColor.ProgressBg;
  export type ProgressText = typeof StatusColor.ProgressText;
  export type ReviewBg = typeof StatusColor.ReviewBg;
  export type ReviewText = typeof StatusColor.ReviewText;
}

export const TextColor = {
  Accent: "text-accent",
  Decorative: "text-decorative",
  Failure: "text-failure",
  Foreground: "text-foreground",
  Info: "text-info",
  Inverse: "text-inverse",
  Muted: "text-muted",
  Placeholder: "text-placeholder",
  Primary: "text-primary",
  Secondary: "text-secondary",
  Success: "text-success",
  Tertiary: "text-tertiary",
  Warning: "text-warning",
} as const;
export type TextColor = `${(typeof TextColor)[keyof typeof TextColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TextColor {
  export type Accent = typeof TextColor.Accent;
  export type Decorative = typeof TextColor.Decorative;
  export type Failure = typeof TextColor.Failure;
  export type Foreground = typeof TextColor.Foreground;
  export type Info = typeof TextColor.Info;
  export type Inverse = typeof TextColor.Inverse;
  export type Muted = typeof TextColor.Muted;
  export type Placeholder = typeof TextColor.Placeholder;
  export type Primary = typeof TextColor.Primary;
  export type Secondary = typeof TextColor.Secondary;
  export type Success = typeof TextColor.Success;
  export type Tertiary = typeof TextColor.Tertiary;
  export type Warning = typeof TextColor.Warning;
}

export const TooltipColor = {
  Bg: "tooltip-bg",
  Text: "tooltip-text",
} as const;
export type TooltipColor =
  `${(typeof TooltipColor)[keyof typeof TooltipColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TooltipColor {
  export type Bg = typeof TooltipColor.Bg;
  export type Text = typeof TooltipColor.Text;
}

export const VizChartColor = {
  Blue: "viz-chart-blue",
  Green: "viz-chart-green",
  Lime: "viz-chart-lime",
  Magenta: "viz-chart-magenta",
  Neutral: "viz-chart-neutral",
  Pink: "viz-chart-pink",
  Purple: "viz-chart-purple",
  Red: "viz-chart-red",
  Teal: "viz-chart-teal",
  Yellow: "viz-chart-yellow",
} as const;
export type VizChartColor =
  `${(typeof VizChartColor)[keyof typeof VizChartColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace VizChartColor {
  export type Blue = typeof VizChartColor.Blue;
  export type Green = typeof VizChartColor.Green;
  export type Lime = typeof VizChartColor.Lime;
  export type Magenta = typeof VizChartColor.Magenta;
  export type Neutral = typeof VizChartColor.Neutral;
  export type Pink = typeof VizChartColor.Pink;
  export type Purple = typeof VizChartColor.Purple;
  export type Red = typeof VizChartColor.Red;
  export type Teal = typeof VizChartColor.Teal;
  export type Yellow = typeof VizChartColor.Yellow;
}

export const VizOverlayColor = {
  Blue: "viz-overlay-blue",
  Green: "viz-overlay-green",
  Lime: "viz-overlay-lime",
  Magenta: "viz-overlay-magenta",
  Neutral: "viz-overlay-neutral",
  Pink: "viz-overlay-pink",
  Purple: "viz-overlay-purple",
  Red: "viz-overlay-red",
  Teal: "viz-overlay-teal",
  Yellow: "viz-overlay-yellow",
} as const;
export type VizOverlayColor =
  `${(typeof VizOverlayColor)[keyof typeof VizOverlayColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace VizOverlayColor {
  export type Blue = typeof VizOverlayColor.Blue;
  export type Green = typeof VizOverlayColor.Green;
  export type Lime = typeof VizOverlayColor.Lime;
  export type Magenta = typeof VizOverlayColor.Magenta;
  export type Neutral = typeof VizOverlayColor.Neutral;
  export type Pink = typeof VizOverlayColor.Pink;
  export type Purple = typeof VizOverlayColor.Purple;
  export type Red = typeof VizOverlayColor.Red;
  export type Teal = typeof VizOverlayColor.Teal;
  export type Yellow = typeof VizOverlayColor.Yellow;
}

export const BrandColor = {
  Primary: "brand-primary",
  Accent: "brand-accent",
} as const;
export type BrandColor = `${(typeof BrandColor)[keyof typeof BrandColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BrandColor {
  export type Primary = typeof BrandColor.Primary;
  export type Accent = typeof BrandColor.Accent;
}

export const SemanticColor = {
  Success: "semantic-success",
  Destructive: "semantic-destructive",
  Info: "semantic-info",
  Warning: "semantic-warning",
} as const;
export type SemanticColor =
  `${(typeof SemanticColor)[keyof typeof SemanticColor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SemanticColor {
  export type Success = typeof SemanticColor.Success;
  export type Destructive = typeof SemanticColor.Destructive;
  export type Info = typeof SemanticColor.Info;
  export type Warning = typeof SemanticColor.Warning;
}

export type Color =
  | BackgroundColor
  | BrandColor
  | CodeColor
  | FocusColor
  | IconColor
  | InteractiveColor
  | LinkColor
  | ScrimColor
  | ScrollbarColor
  | SelectionColor
  | SemanticColor
  | SkeletonColor
  | StatusColor
  | TextColor
  | TooltipColor
  | VizChartColor
  | VizOverlayColor;

export type ThemeableColor = TextColor | IconColor | BrandColor;

const themeableColors = new Set<string>([
  ...Object.values(TextColor),
  ...Object.values(IconColor),
  ...Object.values(BrandColor),
]);

/**
 * Whether a value is one of the {@link ThemeableColor} tokens — which
 * resolve to a CSS var and shift with light/dark theme — as opposed to a
 * raw CSS color, which is a fixed value the theme can't touch. Components
 * that accept `color?: ThemeableColor | string` (a token for anything the
 * design system controls, or a raw value for anything the app controls —
 * e.g. user-defined palettes) use this to tell the two apart at render time.
 */
export function isColorToken(color: string): color is ThemeableColor {
  return themeableColors.has(color);
}

const textColorMap: Record<Color, string> = {
  [BackgroundColor.Transparent]: "text-transparent",
  [BackgroundColor.Accent]: "text-content-bg-accent",
  [BackgroundColor.Background]: "text-content-bg-background",
  [BackgroundColor.Card]: "text-content-bg-card",
  [BackgroundColor.CardElevated]: "text-content-bg-card-elevated",
  [BackgroundColor.CardNested]: "text-content-bg-card-nested",
  [BackgroundColor.Failure]: "text-content-bg-failure",
  [BackgroundColor.Info]: "text-content-bg-info",
  [BackgroundColor.Muted]: "text-content-bg-muted",
  [BackgroundColor.Popover]: "text-content-bg-popover",
  [BackgroundColor.Primary]: "text-content-bg-primary",
  [BackgroundColor.Secondary]: "text-content-bg-secondary",
  [BackgroundColor.Selected]: "text-content-bg-selected",
  [BackgroundColor.Success]: "text-content-bg-success",
  [BackgroundColor.Warning]: "text-content-bg-warning",
  [CodeColor.Bg]: "text-content-code-bg",
  [CodeColor.Border]: "text-content-code-border",
  [CodeColor.Text]: "text-content-code-text",
  [FocusColor.Ring]: "text-content-focus-ring",
  [IconColor.Brand]: "text-content-icon-brand",
  [IconColor.Dark]: "text-content-icon-dark",
  [IconColor.Decorative]: "text-content-icon-decorative",
  [IconColor.Default]: "text-content-icon-default",
  [IconColor.Disabled]: "text-content-icon-disabled",
  [IconColor.Emphasis]: "text-content-icon-emphasis",
  [IconColor.Failure]: "text-content-icon-failure",
  [IconColor.Info]: "text-content-icon-info",
  [IconColor.Muted]: "text-content-icon-muted",
  [IconColor.Subtle]: "text-content-icon-subtle",
  [IconColor.Success]: "text-content-icon-success",
  [IconColor.Warning]: "text-content-icon-warning",
  [InteractiveColor.DangerDefault]: "text-content-interactive-danger-default",
  [InteractiveColor.DangerHover]: "text-content-interactive-danger-hover",
  [InteractiveColor.DangerPressed]: "text-content-interactive-danger-pressed",
  [InteractiveColor.ExpressiveDefaultEnd]:
    "text-content-interactive-expressive-default-end",
  [InteractiveColor.ExpressiveDefaultMid]:
    "text-content-interactive-expressive-default-mid",
  [InteractiveColor.ExpressiveDefaultStart]:
    "text-content-interactive-expressive-default-start",
  [InteractiveColor.ExpressiveHoverEnd]:
    "text-content-interactive-expressive-hover-end",
  [InteractiveColor.ExpressiveHoverMid]:
    "text-content-interactive-expressive-hover-mid",
  [InteractiveColor.ExpressiveHoverStart]:
    "text-content-interactive-expressive-hover-start",
  [InteractiveColor.ExpressivePressedEnd]:
    "text-content-interactive-expressive-pressed-end",
  [InteractiveColor.ExpressivePressedMid]:
    "text-content-interactive-expressive-pressed-mid",
  [InteractiveColor.ExpressivePressedStart]:
    "text-content-interactive-expressive-pressed-start",
  [InteractiveColor.PrimaryDefault]: "text-content-interactive-primary-default",
  [InteractiveColor.PrimaryHover]: "text-content-interactive-primary-hover",
  [InteractiveColor.PrimaryPressed]: "text-content-interactive-primary-pressed",
  [InteractiveColor.SecondaryDefault]:
    "text-content-interactive-secondary-default",
  [InteractiveColor.SecondaryHover]: "text-content-interactive-secondary-hover",
  [InteractiveColor.SecondaryPressed]:
    "text-content-interactive-secondary-pressed",
  [InteractiveColor.SuccessDefault]: "text-content-interactive-success-default",
  [InteractiveColor.SuccessHover]: "text-content-interactive-success-hover",
  [InteractiveColor.SuccessPressed]: "text-content-interactive-success-pressed",
  [LinkColor.Default]: "text-content-link-default",
  [LinkColor.Hover]: "text-content-link-hover",
  [LinkColor.Visited]: "text-content-link-visited",
  [ScrimColor.Default]: "text-content-scrim-default",
  [ScrimColor.Heavy]: "text-content-scrim-heavy",
  [ScrimColor.Light]: "text-content-scrim-light",
  [ScrollbarColor.Thumb]: "text-content-scrollbar-thumb",
  [ScrollbarColor.ThumbHover]: "text-content-scrollbar-thumb-hover",
  [ScrollbarColor.Track]: "text-content-scrollbar-track",
  [SelectionColor.Bg]: "text-content-selection-bg",
  [SelectionColor.Text]: "text-content-selection-text",
  [SkeletonColor.Base]: "text-content-skeleton-base",
  [SkeletonColor.Shimmer]: "text-content-skeleton-shimmer",
  [StatusColor.ApprovedBg]: "text-content-status-approved-bg",
  [StatusColor.ApprovedText]: "text-content-status-approved-text",
  [StatusColor.DraftBg]: "text-content-status-draft-bg",
  [StatusColor.DraftText]: "text-content-status-draft-text",
  [StatusColor.FailedBg]: "text-content-status-failed-bg",
  [StatusColor.FailedText]: "text-content-status-failed-text",
  [StatusColor.ProgressBg]: "text-content-status-progress-bg",
  [StatusColor.ProgressText]: "text-content-status-progress-text",
  [StatusColor.ReviewBg]: "text-content-status-review-bg",
  [StatusColor.ReviewText]: "text-content-status-review-text",
  [TextColor.Accent]: "text-content-text-accent",
  [TextColor.Decorative]: "text-content-text-decorative",
  [TextColor.Failure]: "text-content-text-failure",
  [TextColor.Foreground]: "text-content-text-foreground",
  [TextColor.Info]: "text-content-text-info",
  [TextColor.Inverse]: "text-content-text-inverse",
  [TextColor.Muted]: "text-content-text-muted",
  [TextColor.Placeholder]: "text-content-text-placeholder",
  [TextColor.Primary]: "text-content-text-primary",
  [TextColor.Secondary]: "text-content-text-secondary",
  [TextColor.Success]: "text-content-text-success",
  [TextColor.Tertiary]: "text-content-text-tertiary",
  [TextColor.Warning]: "text-content-text-warning",
  [TooltipColor.Bg]: "text-content-tooltip-bg",
  [TooltipColor.Text]: "text-content-tooltip-text",
  [VizChartColor.Blue]: "text-content-viz-chart-blue",
  [VizChartColor.Green]: "text-content-viz-chart-green",
  [VizChartColor.Lime]: "text-content-viz-chart-lime",
  [VizChartColor.Magenta]: "text-content-viz-chart-magenta",
  [VizChartColor.Neutral]: "text-content-viz-chart-neutral",
  [VizChartColor.Pink]: "text-content-viz-chart-pink",
  [VizChartColor.Purple]: "text-content-viz-chart-purple",
  [VizChartColor.Red]: "text-content-viz-chart-red",
  [VizChartColor.Teal]: "text-content-viz-chart-teal",
  [VizChartColor.Yellow]: "text-content-viz-chart-yellow",
  [VizOverlayColor.Blue]: "text-content-viz-overlay-blue",
  [VizOverlayColor.Green]: "text-content-viz-overlay-green",
  [VizOverlayColor.Lime]: "text-content-viz-overlay-lime",
  [VizOverlayColor.Magenta]: "text-content-viz-overlay-magenta",
  [VizOverlayColor.Neutral]: "text-content-viz-overlay-neutral",
  [VizOverlayColor.Pink]: "text-content-viz-overlay-pink",
  [VizOverlayColor.Purple]: "text-content-viz-overlay-purple",
  [VizOverlayColor.Red]: "text-content-viz-overlay-red",
  [VizOverlayColor.Teal]: "text-content-viz-overlay-teal",
  [VizOverlayColor.Yellow]: "text-content-viz-overlay-yellow",
  [BrandColor.Primary]: "text-brand-primary",
  [BrandColor.Accent]: "text-brand-accent",
  [SemanticColor.Success]: "text-semantic-success",
  [SemanticColor.Destructive]: "text-semantic-destructive",
  [SemanticColor.Info]: "text-semantic-info",
  [SemanticColor.Warning]: "text-semantic-warning",
};

const backgroundColorMap: Record<Color, string> = {
  [BackgroundColor.Transparent]: "bg-transparent",
  [BackgroundColor.Accent]: "bg-content-bg-accent",
  [BackgroundColor.Background]: "bg-content-bg-background",
  [BackgroundColor.Card]: "bg-content-bg-card",
  [BackgroundColor.CardElevated]: "bg-content-bg-card-elevated",
  [BackgroundColor.CardNested]: "bg-content-bg-card-nested",
  [BackgroundColor.Failure]: "bg-content-bg-failure",
  [BackgroundColor.Info]: "bg-content-bg-info",
  [BackgroundColor.Muted]: "bg-content-bg-muted",
  [BackgroundColor.Popover]: "bg-content-bg-popover",
  [BackgroundColor.Primary]: "bg-content-bg-primary",
  [BackgroundColor.Secondary]: "bg-content-bg-secondary",
  [BackgroundColor.Selected]: "bg-content-bg-selected",
  [BackgroundColor.Success]: "bg-content-bg-success",
  [BackgroundColor.Warning]: "bg-content-bg-warning",
  [CodeColor.Bg]: "bg-content-code-bg",
  [CodeColor.Border]: "bg-content-code-border",
  [CodeColor.Text]: "bg-content-code-text",
  [FocusColor.Ring]: "bg-content-focus-ring",
  [IconColor.Brand]: "bg-content-icon-brand",
  [IconColor.Dark]: "bg-content-icon-dark",
  [IconColor.Decorative]: "bg-content-icon-decorative",
  [IconColor.Default]: "bg-content-icon-default",
  [IconColor.Disabled]: "bg-content-icon-disabled",
  [IconColor.Emphasis]: "bg-content-icon-emphasis",
  [IconColor.Failure]: "bg-content-icon-failure",
  [IconColor.Info]: "bg-content-icon-info",
  [IconColor.Muted]: "bg-content-icon-muted",
  [IconColor.Subtle]: "bg-content-icon-subtle",
  [IconColor.Success]: "bg-content-icon-success",
  [IconColor.Warning]: "bg-content-icon-warning",
  [InteractiveColor.DangerDefault]: "bg-content-interactive-danger-default",
  [InteractiveColor.DangerHover]: "bg-content-interactive-danger-hover",
  [InteractiveColor.DangerPressed]: "bg-content-interactive-danger-pressed",
  [InteractiveColor.ExpressiveDefaultEnd]:
    "bg-content-interactive-expressive-default-end",
  [InteractiveColor.ExpressiveDefaultMid]:
    "bg-content-interactive-expressive-default-mid",
  [InteractiveColor.ExpressiveDefaultStart]:
    "bg-content-interactive-expressive-default-start",
  [InteractiveColor.ExpressiveHoverEnd]:
    "bg-content-interactive-expressive-hover-end",
  [InteractiveColor.ExpressiveHoverMid]:
    "bg-content-interactive-expressive-hover-mid",
  [InteractiveColor.ExpressiveHoverStart]:
    "bg-content-interactive-expressive-hover-start",
  [InteractiveColor.ExpressivePressedEnd]:
    "bg-content-interactive-expressive-pressed-end",
  [InteractiveColor.ExpressivePressedMid]:
    "bg-content-interactive-expressive-pressed-mid",
  [InteractiveColor.ExpressivePressedStart]:
    "bg-content-interactive-expressive-pressed-start",
  [InteractiveColor.PrimaryDefault]: "bg-content-interactive-primary-default",
  [InteractiveColor.PrimaryHover]: "bg-content-interactive-primary-hover",
  [InteractiveColor.PrimaryPressed]: "bg-content-interactive-primary-pressed",
  [InteractiveColor.SecondaryDefault]:
    "bg-content-interactive-secondary-default",
  [InteractiveColor.SecondaryHover]: "bg-content-interactive-secondary-hover",
  [InteractiveColor.SecondaryPressed]:
    "bg-content-interactive-secondary-pressed",
  [InteractiveColor.SuccessDefault]: "bg-content-interactive-success-default",
  [InteractiveColor.SuccessHover]: "bg-content-interactive-success-hover",
  [InteractiveColor.SuccessPressed]: "bg-content-interactive-success-pressed",
  [LinkColor.Default]: "bg-content-link-default",
  [LinkColor.Hover]: "bg-content-link-hover",
  [LinkColor.Visited]: "bg-content-link-visited",
  [ScrimColor.Default]: "bg-content-scrim-default",
  [ScrimColor.Heavy]: "bg-content-scrim-heavy",
  [ScrimColor.Light]: "bg-content-scrim-light",
  [ScrollbarColor.Thumb]: "bg-content-scrollbar-thumb",
  [ScrollbarColor.ThumbHover]: "bg-content-scrollbar-thumb-hover",
  [ScrollbarColor.Track]: "bg-content-scrollbar-track",
  [SelectionColor.Bg]: "bg-content-selection-bg",
  [SelectionColor.Text]: "bg-content-selection-text",
  [SkeletonColor.Base]: "bg-content-skeleton-base",
  [SkeletonColor.Shimmer]: "bg-content-skeleton-shimmer",
  [StatusColor.ApprovedBg]: "bg-content-status-approved-bg",
  [StatusColor.ApprovedText]: "bg-content-status-approved-text",
  [StatusColor.DraftBg]: "bg-content-status-draft-bg",
  [StatusColor.DraftText]: "bg-content-status-draft-text",
  [StatusColor.FailedBg]: "bg-content-status-failed-bg",
  [StatusColor.FailedText]: "bg-content-status-failed-text",
  [StatusColor.ProgressBg]: "bg-content-status-progress-bg",
  [StatusColor.ProgressText]: "bg-content-status-progress-text",
  [StatusColor.ReviewBg]: "bg-content-status-review-bg",
  [StatusColor.ReviewText]: "bg-content-status-review-text",
  [TextColor.Accent]: "bg-content-text-accent",
  [TextColor.Decorative]: "bg-content-text-decorative",
  [TextColor.Failure]: "bg-content-text-failure",
  [TextColor.Foreground]: "bg-content-text-foreground",
  [TextColor.Info]: "bg-content-text-info",
  [TextColor.Inverse]: "bg-content-text-inverse",
  [TextColor.Muted]: "bg-content-text-muted",
  [TextColor.Placeholder]: "bg-content-text-placeholder",
  [TextColor.Primary]: "bg-content-text-primary",
  [TextColor.Secondary]: "bg-content-text-secondary",
  [TextColor.Success]: "bg-content-text-success",
  [TextColor.Tertiary]: "bg-content-text-tertiary",
  [TextColor.Warning]: "bg-content-text-warning",
  [TooltipColor.Bg]: "bg-content-tooltip-bg",
  [TooltipColor.Text]: "bg-content-tooltip-text",
  [VizChartColor.Blue]: "bg-content-viz-chart-blue",
  [VizChartColor.Green]: "bg-content-viz-chart-green",
  [VizChartColor.Lime]: "bg-content-viz-chart-lime",
  [VizChartColor.Magenta]: "bg-content-viz-chart-magenta",
  [VizChartColor.Neutral]: "bg-content-viz-chart-neutral",
  [VizChartColor.Pink]: "bg-content-viz-chart-pink",
  [VizChartColor.Purple]: "bg-content-viz-chart-purple",
  [VizChartColor.Red]: "bg-content-viz-chart-red",
  [VizChartColor.Teal]: "bg-content-viz-chart-teal",
  [VizChartColor.Yellow]: "bg-content-viz-chart-yellow",
  [VizOverlayColor.Blue]: "bg-content-viz-overlay-blue",
  [VizOverlayColor.Green]: "bg-content-viz-overlay-green",
  [VizOverlayColor.Lime]: "bg-content-viz-overlay-lime",
  [VizOverlayColor.Magenta]: "bg-content-viz-overlay-magenta",
  [VizOverlayColor.Neutral]: "bg-content-viz-overlay-neutral",
  [VizOverlayColor.Pink]: "bg-content-viz-overlay-pink",
  [VizOverlayColor.Purple]: "bg-content-viz-overlay-purple",
  [VizOverlayColor.Red]: "bg-content-viz-overlay-red",
  [VizOverlayColor.Teal]: "bg-content-viz-overlay-teal",
  [VizOverlayColor.Yellow]: "bg-content-viz-overlay-yellow",
  [BrandColor.Primary]: "bg-brand-primary",
  [BrandColor.Accent]: "bg-brand-accent",
  [SemanticColor.Success]: "bg-semantic-success",
  [SemanticColor.Destructive]: "bg-semantic-destructive",
  [SemanticColor.Info]: "bg-semantic-info",
  [SemanticColor.Warning]: "bg-semantic-warning",
};

/** Every `Color` value. Generated — do not hand-maintain. */
export const ALL_COLORS: readonly Color[] = [
  BackgroundColor.Transparent,
  BackgroundColor.Accent,
  BackgroundColor.Background,
  BackgroundColor.Card,
  BackgroundColor.CardElevated,
  BackgroundColor.CardNested,
  BackgroundColor.Failure,
  BackgroundColor.Info,
  BackgroundColor.Muted,
  BackgroundColor.Popover,
  BackgroundColor.Primary,
  BackgroundColor.Secondary,
  BackgroundColor.Selected,
  BackgroundColor.Success,
  BackgroundColor.Warning,
  CodeColor.Bg,
  CodeColor.Border,
  CodeColor.Text,
  FocusColor.Ring,
  IconColor.Brand,
  IconColor.Dark,
  IconColor.Decorative,
  IconColor.Default,
  IconColor.Disabled,
  IconColor.Emphasis,
  IconColor.Failure,
  IconColor.Info,
  IconColor.Muted,
  IconColor.Subtle,
  IconColor.Success,
  IconColor.Warning,
  InteractiveColor.DangerDefault,
  InteractiveColor.DangerHover,
  InteractiveColor.DangerPressed,
  InteractiveColor.ExpressiveDefaultEnd,
  InteractiveColor.ExpressiveDefaultMid,
  InteractiveColor.ExpressiveDefaultStart,
  InteractiveColor.ExpressiveHoverEnd,
  InteractiveColor.ExpressiveHoverMid,
  InteractiveColor.ExpressiveHoverStart,
  InteractiveColor.ExpressivePressedEnd,
  InteractiveColor.ExpressivePressedMid,
  InteractiveColor.ExpressivePressedStart,
  InteractiveColor.PrimaryDefault,
  InteractiveColor.PrimaryHover,
  InteractiveColor.PrimaryPressed,
  InteractiveColor.SecondaryDefault,
  InteractiveColor.SecondaryHover,
  InteractiveColor.SecondaryPressed,
  InteractiveColor.SuccessDefault,
  InteractiveColor.SuccessHover,
  InteractiveColor.SuccessPressed,
  LinkColor.Default,
  LinkColor.Hover,
  LinkColor.Visited,
  ScrimColor.Default,
  ScrimColor.Heavy,
  ScrimColor.Light,
  ScrollbarColor.Thumb,
  ScrollbarColor.ThumbHover,
  ScrollbarColor.Track,
  SelectionColor.Bg,
  SelectionColor.Text,
  SkeletonColor.Base,
  SkeletonColor.Shimmer,
  StatusColor.ApprovedBg,
  StatusColor.ApprovedText,
  StatusColor.DraftBg,
  StatusColor.DraftText,
  StatusColor.FailedBg,
  StatusColor.FailedText,
  StatusColor.ProgressBg,
  StatusColor.ProgressText,
  StatusColor.ReviewBg,
  StatusColor.ReviewText,
  TextColor.Accent,
  TextColor.Decorative,
  TextColor.Failure,
  TextColor.Foreground,
  TextColor.Info,
  TextColor.Inverse,
  TextColor.Muted,
  TextColor.Placeholder,
  TextColor.Primary,
  TextColor.Secondary,
  TextColor.Success,
  TextColor.Tertiary,
  TextColor.Warning,
  TooltipColor.Bg,
  TooltipColor.Text,
  VizChartColor.Blue,
  VizChartColor.Green,
  VizChartColor.Lime,
  VizChartColor.Magenta,
  VizChartColor.Neutral,
  VizChartColor.Pink,
  VizChartColor.Purple,
  VizChartColor.Red,
  VizChartColor.Teal,
  VizChartColor.Yellow,
  VizOverlayColor.Blue,
  VizOverlayColor.Green,
  VizOverlayColor.Lime,
  VizOverlayColor.Magenta,
  VizOverlayColor.Neutral,
  VizOverlayColor.Pink,
  VizOverlayColor.Purple,
  VizOverlayColor.Red,
  VizOverlayColor.Teal,
  VizOverlayColor.Yellow,
  BrandColor.Primary,
  BrandColor.Accent,
  SemanticColor.Success,
  SemanticColor.Destructive,
  SemanticColor.Info,
  SemanticColor.Warning,
];

const borderColorMap: Record<BorderColor, string> = {
  [BorderColor.Active]: "border-content-border-active",
  [BorderColor.Default]: "border-content-border-default",
  [BorderColor.Disabled]: "border-content-border-disabled",
  [BorderColor.Error]: "border-content-border-error",
  [BorderColor.Focus]: "border-content-border-focus",
  [BorderColor.Hover]: "border-content-border-hover",
  [BorderColor.Input]: "border-content-border-input",
  [BorderColor.InputFocus]: "border-content-border-input-focus",
  [BorderColor.InputHover]: "border-content-border-input-hover",
  [BorderColor.Strong]: "border-content-border-strong",
  [BorderColor.Subtle]: "border-content-border-subtle",
  [BorderColor.Success]: "border-content-border-success",
  [BorderColor.Warning]: "border-content-border-warning",
  [BorderColor.CardElevated]: "border-content-bg-card-elevated",
};

export const bgColorClass = (
  color: Color,
  elementState: ElementState = ElementState.None
): string => {
  if (elementState === ElementState.None) {
    return backgroundColorMap[color];
  }

  return withElementState(`bg-[${getColorCssVar(color)}]`, elementState);
};

/**
 * Resolves a design-token color to a ready-to-use CSS value, e.g.
 * `var(--color-content-text-primary)`. Safe to drop directly into an
 * inline `style` prop (`style={{ color: getColorCssVar(TextColor.Success) }}`)
 * or wrap in a Tailwind arbitrary value (`` `bg-[${getColorCssVar(color)}]` ``)
 * — don't wrap the result in `var(...)` yourself, it's already included.
 */
export const getColorCssVar = (color: Color | BorderColor): string => {
  const name =
    isTokenValue(color, BrandColor) || isTokenValue(color, SemanticColor)
      ? `--color-${color}`
      : `--color-content-${color}`;

  return `var(${name})`;
};

const isTokenValue = <T extends Record<string, string>>(
  value: unknown,
  tokenType: T
): value is T[keyof T] => {
  return Object.values(tokenType).includes(value as string);
};

export const borderColorClass = (
  color: BorderColor,
  elementState: ElementState = ElementState.None
): string => {
  if (elementState === ElementState.None) {
    return borderColorMap[color];
  }

  return withElementState(`border-[${getColorCssVar(color)}]`, elementState);
};

export const textColorClass = (
  color: Color,
  elementState: ElementState = ElementState.None
): string => {
  if (elementState === ElementState.None) {
    return textColorMap[color];
  }

  return withElementState(`text-[${getColorCssVar(color)}]`, elementState);
};
