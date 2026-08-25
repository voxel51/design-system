import { ElementState, withElementState } from "@/types/element";

/**
 * Color tokens as enums — GENERATED from Figma's variable export by
 * kb/eng/projects/design-system-tokens/tools/build_color_enums.py.
 * Do not edit by hand; re-run the generator instead.
 *
 * Enum values are the Figma variable names, so they line up 1:1 with the
 * CSS custom properties emitted from colors.ts.
 */

export enum BackgroundColor {
  Transparent = "bg-transparent",
  Accent = "bg-accent",
  Background = "bg-background",
  Card1 = "bg-card-1",
  Card2 = "bg-card-2",
  CardElevated = "bg-card-elevated",
  Failure = "bg-failure",
  Info = "bg-info",
  Muted = "bg-muted",
  Popover = "bg-popover",
  Primary = "bg-primary",
  Secondary = "bg-secondary",
  Selected = "bg-selected",
  Success = "bg-success",
  Warning = "bg-warning",
}

export enum BorderColor {
  Active = "border-active",
  Default = "border-default",
  Disabled = "border-disabled",
  Error = "border-error",
  Focus = "border-focus",
  Hover = "border-hover",
  Input = "border-input",
  InputFocus = "border-input-focus",
  InputHover = "border-input-hover",
  Strong = "border-strong",
  Subtle = "border-subtle",
  Success = "border-success",
  Warning = "border-warning",
  CardElevated = "bg-card-elevated",
}

export enum CodeColor {
  Bg = "code-bg",
  Border = "code-border",
  Text = "code-text",
}

export enum FocusColor {
  Ring = "focus-ring",
}

export enum IconColor {
  Brand = "icon-brand",
  Dark = "icon-dark",
  Decorative = "icon-decorative",
  Default = "icon-default",
  Disabled = "icon-disabled",
  Emphasis = "icon-emphasis",
  Failure = "icon-failure",
  Info = "icon-info",
  Muted = "icon-muted",
  Subtle = "icon-subtle",
  Success = "icon-success",
  Warning = "icon-warning",
}

export enum InteractiveColor {
  DangerDefault = "interactive-danger-default",
  DangerHover = "interactive-danger-hover",
  DangerPressed = "interactive-danger-pressed",
  PrimaryDefault = "interactive-primary-default",
  PrimaryHover = "interactive-primary-hover",
  PrimaryPressed = "interactive-primary-pressed",
  SecondaryDefault = "interactive-secondary-default",
  SecondaryHover = "interactive-secondary-hover",
  SecondaryPressed = "interactive-secondary-pressed",
  SuccessDefault = "interactive-success-default",
  SuccessHover = "interactive-success-hover",
  SuccessPressed = "interactive-success-pressed",
}

export enum LinkColor {
  Default = "link-default",
  Hover = "link-hover",
  Visited = "link-visited",
}

export enum OverlayColor {
  Default = "overlay-default",
  Heavy = "overlay-heavy",
  Light = "overlay-light",
}

export enum PaletteColor {
  P1Brand = "palette-1-brand",
  P2Blue = "palette-2-blue",
  P3Green = "palette-3-green",
  P4Violet = "palette-4-violet",
  P5Pink = "palette-5-pink",
  P6Amber = "palette-6-amber",
  P7Teal = "palette-7-teal",
  P8Purple = "palette-8-purple",
  P9Indigo = "palette-9-indigo",
  P10Red = "palette-10-red",
  P11Gold = "palette-11-gold",
  P12Sage = "palette-12-sage",
  P13Sky = "palette-13-sky",
  P14Lime = "palette-14-lime",
  P15Magenta = "palette-15-magenta",
  P16Slate = "palette-16-slate",
  P17Rose = "palette-17-rose",
  P18Mint = "palette-18-mint",
}

export enum ScrollbarColor {
  Thumb = "scrollbar-thumb",
  ThumbHover = "scrollbar-thumb-hover",
  Track = "scrollbar-track",
}

export enum SelectionColor {
  Bg = "selection-bg",
  Text = "selection-text",
}

export enum SkeletonColor {
  Base = "skeleton-base",
  Shimmer = "skeleton-shimmer",
}

export enum StatusColor {
  ApprovedBg = "status-approved-bg",
  ApprovedText = "status-approved-text",
  DraftBg = "status-draft-bg",
  DraftText = "status-draft-text",
  FailedBg = "status-failed-bg",
  FailedText = "status-failed-text",
  ProgressBg = "status-progress-bg",
  ProgressText = "status-progress-text",
  ReviewBg = "status-review-bg",
  ReviewText = "status-review-text",
}

export enum TextColor {
  Accent = "text-accent",
  Decorative = "text-decorative",
  Failure = "text-failure",
  Foreground = "text-foreground",
  Info = "text-info",
  Muted = "text-muted",
  Placeholder = "text-placeholder",
  Primary = "text-primary",
  Secondary = "text-secondary",
  Success = "text-success",
  Tertiary = "text-tertiary",
  Warning = "text-warning",
}

export enum TooltipColor {
  Bg = "tooltip-bg",
  Text = "tooltip-text",
}

export enum BrandColor {
  Primary = "brand-primary",
  Accent = "brand-accent",
}

export enum SemanticColor {
  Success = "semantic-success",
  Destructive = "semantic-destructive",
  Info = "semantic-info",
  Warning = "semantic-warning",
}

export type Color =
  | BackgroundColor
  | BrandColor
  | CodeColor
  | FocusColor
  | IconColor
  | InteractiveColor
  | LinkColor
  | OverlayColor
  | PaletteColor
  | ScrollbarColor
  | SelectionColor
  | SemanticColor
  | SkeletonColor
  | StatusColor
  | TextColor
  | TooltipColor;

const textColorMap: Record<Color, string> = {
  [BackgroundColor.Transparent]: "text-transparent",
  [BackgroundColor.Accent]: "text-content-bg-accent",
  [BackgroundColor.Background]: "text-content-bg-background",
  [BackgroundColor.Card1]: "text-content-bg-card-1",
  [BackgroundColor.Card2]: "text-content-bg-card-2",
  [BackgroundColor.CardElevated]: "text-content-bg-card-elevated",
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
  [OverlayColor.Default]: "text-content-overlay-default",
  [OverlayColor.Heavy]: "text-content-overlay-heavy",
  [OverlayColor.Light]: "text-content-overlay-light",
  [PaletteColor.P1Brand]: "text-content-palette-1-brand",
  [PaletteColor.P2Blue]: "text-content-palette-2-blue",
  [PaletteColor.P3Green]: "text-content-palette-3-green",
  [PaletteColor.P4Violet]: "text-content-palette-4-violet",
  [PaletteColor.P5Pink]: "text-content-palette-5-pink",
  [PaletteColor.P6Amber]: "text-content-palette-6-amber",
  [PaletteColor.P7Teal]: "text-content-palette-7-teal",
  [PaletteColor.P8Purple]: "text-content-palette-8-purple",
  [PaletteColor.P9Indigo]: "text-content-palette-9-indigo",
  [PaletteColor.P10Red]: "text-content-palette-10-red",
  [PaletteColor.P11Gold]: "text-content-palette-11-gold",
  [PaletteColor.P12Sage]: "text-content-palette-12-sage",
  [PaletteColor.P13Sky]: "text-content-palette-13-sky",
  [PaletteColor.P14Lime]: "text-content-palette-14-lime",
  [PaletteColor.P15Magenta]: "text-content-palette-15-magenta",
  [PaletteColor.P16Slate]: "text-content-palette-16-slate",
  [PaletteColor.P17Rose]: "text-content-palette-17-rose",
  [PaletteColor.P18Mint]: "text-content-palette-18-mint",
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
  [TextColor.Muted]: "text-content-text-muted",
  [TextColor.Placeholder]: "text-content-text-placeholder",
  [TextColor.Primary]: "text-content-text-primary",
  [TextColor.Secondary]: "text-content-text-secondary",
  [TextColor.Success]: "text-content-text-success",
  [TextColor.Tertiary]: "text-content-text-tertiary",
  [TextColor.Warning]: "text-content-text-warning",
  [TooltipColor.Bg]: "text-content-tooltip-bg",
  [TooltipColor.Text]: "text-content-tooltip-text",
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
  [BackgroundColor.Card1]: "bg-content-bg-card-1",
  [BackgroundColor.Card2]: "bg-content-bg-card-2",
  [BackgroundColor.CardElevated]: "bg-content-bg-card-elevated",
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
  [OverlayColor.Default]: "bg-content-overlay-default",
  [OverlayColor.Heavy]: "bg-content-overlay-heavy",
  [OverlayColor.Light]: "bg-content-overlay-light",
  [PaletteColor.P1Brand]: "bg-content-palette-1-brand",
  [PaletteColor.P2Blue]: "bg-content-palette-2-blue",
  [PaletteColor.P3Green]: "bg-content-palette-3-green",
  [PaletteColor.P4Violet]: "bg-content-palette-4-violet",
  [PaletteColor.P5Pink]: "bg-content-palette-5-pink",
  [PaletteColor.P6Amber]: "bg-content-palette-6-amber",
  [PaletteColor.P7Teal]: "bg-content-palette-7-teal",
  [PaletteColor.P8Purple]: "bg-content-palette-8-purple",
  [PaletteColor.P9Indigo]: "bg-content-palette-9-indigo",
  [PaletteColor.P10Red]: "bg-content-palette-10-red",
  [PaletteColor.P11Gold]: "bg-content-palette-11-gold",
  [PaletteColor.P12Sage]: "bg-content-palette-12-sage",
  [PaletteColor.P13Sky]: "bg-content-palette-13-sky",
  [PaletteColor.P14Lime]: "bg-content-palette-14-lime",
  [PaletteColor.P15Magenta]: "bg-content-palette-15-magenta",
  [PaletteColor.P16Slate]: "bg-content-palette-16-slate",
  [PaletteColor.P17Rose]: "bg-content-palette-17-rose",
  [PaletteColor.P18Mint]: "bg-content-palette-18-mint",
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
  [TextColor.Muted]: "bg-content-text-muted",
  [TextColor.Placeholder]: "bg-content-text-placeholder",
  [TextColor.Primary]: "bg-content-text-primary",
  [TextColor.Secondary]: "bg-content-text-secondary",
  [TextColor.Success]: "bg-content-text-success",
  [TextColor.Tertiary]: "bg-content-text-tertiary",
  [TextColor.Warning]: "bg-content-text-warning",
  [TooltipColor.Bg]: "bg-content-tooltip-bg",
  [TooltipColor.Text]: "bg-content-tooltip-text",
  [BrandColor.Primary]: "bg-brand-primary",
  [BrandColor.Accent]: "bg-brand-accent",
  [SemanticColor.Success]: "bg-semantic-success",
  [SemanticColor.Destructive]: "bg-semantic-destructive",
  [SemanticColor.Info]: "bg-semantic-info",
  [SemanticColor.Warning]: "bg-semantic-warning",
};

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

  return withElementState(`bg-[var(${getColorCssVar(color)})]`, elementState);
};

export const getColorCssVar = (color: Color | BorderColor): string => {
  if (isEnumValue(color, BrandColor) || isEnumValue(color, SemanticColor)) {
    return `--color-${color}`;
  }

  return `--color-content-${color}`;
};

const isEnumValue = <T extends Record<string, string>>(
  value: unknown,
  enumType: T
): value is T[keyof T] => {
  return Object.values(enumType).includes(value as string);
};

export const borderColorClass = (
  color: BorderColor,
  elementState: ElementState = ElementState.None
): string => {
  if (elementState === ElementState.None) {
    return borderColorMap[color];
  }

  return withElementState(
    `border-[var(${getColorCssVar(color)})]`,
    elementState
  );
};

export const textColorClass = (
  color: Color,
  elementState: ElementState = ElementState.None
): string => {
  if (elementState === ElementState.None) {
    return textColorMap[color];
  }

  return withElementState(`text-[var(${getColorCssVar(color)})]`, elementState);
};
