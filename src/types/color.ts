import { ElementState, withElementState } from "@/types/element";

export enum ActionColor {
  PrimaryDefault = "action-primary-primary",
  PrimaryHover = "action-primary-secondary",
  PrimaryFocus = "action-primary-tertiary",
  PrimaryText = "action-primary-text",
  SecondaryDefault = "action-secondary-primary",
  SecondaryHover = "action-secondary-secondary",
  SecondaryFocus = "action-secondary-tertiary",
  SecondaryText = "action-secondary-text",
  SuccessDefault = "action-success-primary",
  SuccessHover = "action-success-secondary",
  SuccessFocus = "action-success-tertiary",
  SuccessText = "action-success-text",
  DangerDefault = "action-danger-primary",
  DangerHover = "action-danger-secondary",
  DangerFocus = "action-danger-tertiary",
  DangerText = "action-danger-text",
  IconDefault = "action-icon-default",
}

export enum BackgroundColor {
  Transparent = "bg-transparent",
  Background = "bg-background",
  Card1 = "bg-card-1",
  Card2 = "bg-card-2",
  CardElevated = "bg-card-elevated",
  Muted = "bg-muted",
  Popover = "bg-popover",
  Selected = "bg-selected",
  Secondary = "bg-secondary",
  Raised = "bg-raised",
}

export enum BorderColor {
  Default = "border-default",
  Strong = "border-strong",
  Hover = "border-hover",
  Focus = "border-focus",
  Subtle = "border-subtle",
  Active = "border-active",
  Error = "border-error",
  Success = "border-success",
  Warning = "border-warning",
  Disabled = "border-disabled",
  CardElevated = "bg-card-elevated",
  Input = "border-input",
  InputHover = "border-input-hover",
  InputFocus = "border-input-focus",
}

export enum BrandColor {
  Primary = "brand-primary",
  Accent = "brand-accent",
}

export enum IconColor {
  Default = "icon-default",
  Subtle = "icon-subtle",
  Emphasis = "icon-emphasis",
  Muted = "icon-muted",
  Disabled = "icon-disabled",
  Decorative = "icon-decorative",
  Brand = "icon-brand",
  BrandAccent = "icon-brand-accent",
  Success = "icon-success",
  Destructive = "icon-destructive",
  Warning = "icon-warning",
  Info = "icon-info",
  Dark = "icon-dark",
}

export enum SemanticColor {
  Success = "semantic-success",
  Destructive = "semantic-destructive",
  Info = "semantic-info",
  Warning = "semantic-warning",
}

export enum StatusColor {
  Approved = "status-approved",
  Review = "status-review",
  Progress = "status-progress",
  Default = "status-default",
  Failed = "status-failed",
}

export enum TextColor {
  Fg = "text-fg",
  Primary = "text-primary",
  Secondary = "text-secondary",
  Tertiary = "text-tertiary",
  Muted = "text-muted",
  Placeholder = "text-placeholder",
  Success = "text-success",
  Destructive = "text-destructive",
  Warning = "text-warning",
  Info = "text-info",
  Accent = "text-accent",
  Decorative = "text-decorative",
}

export enum OverlayColor {
  Default = "overlay-default",
  Light = "overlay-light",
  Heavy = "overlay-heavy",
}

export enum FocusColor {
  Ring = "focus-ring",
}

export enum LinkColor {
  Default = "link-default",
  Hover = "link-hover",
  Visited = "link-visited",
}

export enum PaletteColor {
  P1 = "palette-1",
  P2 = "palette-2",
  P3 = "palette-3",
  P4 = "palette-4",
  P5 = "palette-5",
  P6 = "palette-6",
  P7 = "palette-7",
  P8 = "palette-8",
  P9 = "palette-9",
  P10 = "palette-10",
  P11 = "palette-11",
  P12 = "palette-12",
  // hue-named aliases for the primary (500-shade) entries — same value as the
  // numeric slot; use numbers to iterate categories, names for a specific hue
  Orange = "palette-orange",
  Blue = "palette-blue",
  Green = "palette-green",
  Purple = "palette-purple",
  Pink = "palette-pink",
  Yellow = "palette-yellow",
  Teal = "palette-teal",
  Red = "palette-red",
}

export enum SkeletonColor {
  Base = "skeleton-base",
  Shimmer = "skeleton-shimmer",
}

export enum TooltipColor {
  Bg = "tooltip-bg",
  Text = "tooltip-text",
}

export enum CodeColor {
  Bg = "code-bg",
  Text = "code-text",
  Border = "code-border",
}

export enum ScrollbarColor {
  Track = "scrollbar-track",
  Thumb = "scrollbar-thumb",
  ThumbHover = "scrollbar-thumb-hover",
}

export enum SelectionColor {
  Bg = "selection-bg",
  Text = "selection-text",
}

export type Color =
  | ActionColor
  | BackgroundColor
  | BrandColor
  | IconColor
  | SemanticColor
  | StatusColor
  | TextColor
  | OverlayColor
  | FocusColor
  | LinkColor
  | PaletteColor
  | SkeletonColor
  | TooltipColor
  | CodeColor
  | ScrollbarColor
  | SelectionColor;

/**
 * Tokens valid for text and icon color. Deliberately a subset of
 * {@link Color}: most other tokens (`BackgroundColor`, `BorderColor`,
 * `ScrollbarColor`, `SkeletonColor`, `OverlayColor`, `FocusColor`, ...)
 * describe surfaces, borders, or component-specific chrome, not text/icon
 * color — accepting them here would be a category error, not added
 * flexibility.
 */
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
  [ActionColor.IconDefault]: "text-content-text-secondary",
  [ActionColor.PrimaryDefault]: "text-action-primary-primary",
  [ActionColor.PrimaryHover]: "text-action-primary-secondary",
  [ActionColor.PrimaryFocus]: "text-action-primary-tertiary",
  [ActionColor.PrimaryText]: "text-action-primary-text",
  [ActionColor.SecondaryDefault]: "text-action-secondary-primary",
  [ActionColor.SecondaryHover]: "text-action-secondary-secondary",
  [ActionColor.SecondaryFocus]: "text-action-secondary-tertiary",
  [ActionColor.SecondaryText]: "text-action-secondary-text",
  [ActionColor.SuccessDefault]: "text-action-success-primary",
  [ActionColor.SuccessHover]: "text-action-success-secondary",
  [ActionColor.SuccessFocus]: "text-action-success-tertiary",
  [ActionColor.SuccessText]: "text-action-success-text",
  [ActionColor.DangerDefault]: "text-action-danger-primary",
  [ActionColor.DangerHover]: "text-action-danger-secondary",
  [ActionColor.DangerFocus]: "text-action-danger-tertiary",
  [ActionColor.DangerText]: "text-action-danger-text",

  [BackgroundColor.Background]: "text-content-bg-background",
  [BackgroundColor.Card1]: "text-content-bg-card-1",
  [BackgroundColor.Card2]: "text-content-bg-card-2",
  [BackgroundColor.CardElevated]: "text-content-bg-card-elevated",
  [BackgroundColor.Muted]: "text-content-bg-muted",
  [BackgroundColor.Popover]: "text-content-bg-popover",
  [BackgroundColor.Secondary]: "text-content-bg-secondary",
  [BackgroundColor.Selected]: "text-content-bg-selected",
  [BackgroundColor.Raised]: "text-content-bg-raised",
  [BackgroundColor.Transparent]: "text-transparent",

  [BrandColor.Accent]: "text-brand-accent",
  [BrandColor.Primary]: "text-brand-primary",

  [IconColor.Brand]: "text-content-icon-brand",
  [IconColor.BrandAccent]: "text-content-icon-brand-accent",
  [IconColor.Decorative]: "text-content-icon-decorative",
  [IconColor.Default]: "text-content-icon-default",
  [IconColor.Destructive]: "text-content-icon-destructive",
  [IconColor.Disabled]: "text-content-icon-disabled",
  [IconColor.Emphasis]: "text-content-icon-emphasis",
  [IconColor.Info]: "text-content-icon-info",
  [IconColor.Muted]: "text-content-icon-muted",
  [IconColor.Subtle]: "text-content-icon-subtle",
  [IconColor.Success]: "text-content-icon-success",
  [IconColor.Warning]: "text-content-icon-warning",

  [SemanticColor.Destructive]: "text-semantic-destructive",
  [SemanticColor.Info]: "text-semantic-info",
  [SemanticColor.Success]: "text-semantic-success",
  [SemanticColor.Warning]: "text-semantic-warning",

  [StatusColor.Approved]: "text-content-status-approved",
  [StatusColor.Default]: "text-content-status-default",
  [StatusColor.Failed]: "text-content-status-failed",
  [StatusColor.Progress]: "text-content-status-progress",
  [StatusColor.Review]: "text-content-status-review",

  [TextColor.Destructive]: "text-content-text-destructive",
  [TextColor.Fg]: "text-content-text-fg",
  [TextColor.Info]: "text-content-text-info",
  [TextColor.Muted]: "text-content-text-muted",
  [TextColor.Placeholder]: "text-content-text-placeholder",
  [TextColor.Primary]: "text-content-text-primary",
  [TextColor.Secondary]: "text-content-text-secondary",
  [TextColor.Success]: "text-content-text-success",
  [TextColor.Tertiary]: "text-content-text-tertiary",
  [TextColor.Warning]: "text-content-text-warning",
  [TextColor.Accent]: "text-content-text-accent",
  [TextColor.Decorative]: "text-content-text-decorative",
  [IconColor.Dark]: "text-content-icon-dark",
  [OverlayColor.Default]: "text-content-overlay-default",
  [OverlayColor.Light]: "text-content-overlay-light",
  [OverlayColor.Heavy]: "text-content-overlay-heavy",
  [FocusColor.Ring]: "text-content-focus-ring",
  [LinkColor.Default]: "text-content-link-default",
  [LinkColor.Hover]: "text-content-link-hover",
  [LinkColor.Visited]: "text-content-link-visited",
  [PaletteColor.P1]: "text-content-palette-1",
  [PaletteColor.P2]: "text-content-palette-2",
  [PaletteColor.P3]: "text-content-palette-3",
  [PaletteColor.P4]: "text-content-palette-4",
  [PaletteColor.P5]: "text-content-palette-5",
  [PaletteColor.P6]: "text-content-palette-6",
  [PaletteColor.P7]: "text-content-palette-7",
  [PaletteColor.P8]: "text-content-palette-8",
  [PaletteColor.P9]: "text-content-palette-9",
  [PaletteColor.P10]: "text-content-palette-10",
  [PaletteColor.P11]: "text-content-palette-11",
  [PaletteColor.P12]: "text-content-palette-12",
  [PaletteColor.Orange]: "text-content-palette-orange",
  [PaletteColor.Blue]: "text-content-palette-blue",
  [PaletteColor.Green]: "text-content-palette-green",
  [PaletteColor.Purple]: "text-content-palette-purple",
  [PaletteColor.Pink]: "text-content-palette-pink",
  [PaletteColor.Yellow]: "text-content-palette-yellow",
  [PaletteColor.Teal]: "text-content-palette-teal",
  [PaletteColor.Red]: "text-content-palette-red",
  [SkeletonColor.Base]: "text-content-skeleton-base",
  [SkeletonColor.Shimmer]: "text-content-skeleton-shimmer",
  [TooltipColor.Bg]: "text-content-tooltip-bg",
  [TooltipColor.Text]: "text-content-tooltip-text",
  [CodeColor.Bg]: "text-content-code-bg",
  [CodeColor.Text]: "text-content-code-text",
  [CodeColor.Border]: "text-content-code-border",
  [ScrollbarColor.Track]: "text-content-scrollbar-track",
  [ScrollbarColor.Thumb]: "text-content-scrollbar-thumb",
  [ScrollbarColor.ThumbHover]: "text-content-scrollbar-thumb-hover",
  [SelectionColor.Bg]: "text-content-selection-bg",
  [SelectionColor.Text]: "text-content-selection-text",
};

const backgroundColorMap: Record<Color, string> = {
  [BackgroundColor.Transparent]: "bg-transparent",
  [ActionColor.IconDefault]: "bg-transparent",
  [ActionColor.PrimaryDefault]: "bg-action-primary-primary",
  [ActionColor.PrimaryHover]: "bg-action-primary-secondary",
  [ActionColor.PrimaryFocus]: "bg-action-primary-tertiary",
  [ActionColor.PrimaryText]: "bg-action-primary-text",
  [ActionColor.SecondaryDefault]: "bg-action-secondary-primary",
  [ActionColor.SecondaryHover]: "bg-action-secondary-secondary",
  [ActionColor.SecondaryFocus]: "bg-action-secondary-tertiary",
  [ActionColor.SecondaryText]: "bg-action-secondary-text",
  [ActionColor.SuccessDefault]: "bg-action-success-primary",
  [ActionColor.SuccessHover]: "bg-action-success-secondary",
  [ActionColor.SuccessFocus]: "bg-action-success-tertiary",
  [ActionColor.SuccessText]: "bg-action-success-text",
  [ActionColor.DangerDefault]: "bg-action-danger-primary",
  [ActionColor.DangerHover]: "bg-action-danger-secondary",
  [ActionColor.DangerFocus]: "bg-action-danger-tertiary",
  [ActionColor.DangerText]: "bg-action-danger-text",

  [BackgroundColor.Background]: "bg-content-bg-background",
  [BackgroundColor.Card1]: "bg-content-bg-card-1",
  [BackgroundColor.Card2]: "bg-content-bg-card-2",
  [BackgroundColor.CardElevated]: "bg-content-bg-card-elevated",
  [BackgroundColor.Muted]: "bg-content-bg-muted",
  [BackgroundColor.Popover]: "bg-content-bg-popover",
  [BackgroundColor.Secondary]: "bg-content-bg-secondary",
  [BackgroundColor.Selected]: "bg-content-bg-selected",
  [BackgroundColor.Raised]: "bg-content-bg-raised",

  [BrandColor.Accent]: "bg-brand-accent",
  [BrandColor.Primary]: "bg-brand-primary",

  [IconColor.Brand]: "bg-content-icon-brand",
  [IconColor.BrandAccent]: "bg-content-icon-brand-accent",
  [IconColor.Decorative]: "bg-content-icon-decorative",
  [IconColor.Default]: "bg-content-icon-default",
  [IconColor.Destructive]: "bg-content-icon-destructive",
  [IconColor.Disabled]: "bg-content-icon-disabled",
  [IconColor.Emphasis]: "bg-content-icon-emphasis",
  [IconColor.Info]: "bg-content-icon-info",
  [IconColor.Muted]: "bg-content-icon-muted",
  [IconColor.Subtle]: "bg-content-icon-subtle",
  [IconColor.Success]: "bg-content-icon-success",
  [IconColor.Warning]: "bg-content-icon-warning",

  [SemanticColor.Destructive]: "bg-semantic-destructive",
  [SemanticColor.Info]: "bg-semantic-info",
  [SemanticColor.Success]: "bg-semantic-success",
  [SemanticColor.Warning]: "bg-semantic-warning",

  [StatusColor.Approved]: "bg-content-status-approved",
  [StatusColor.Default]: "bg-content-status-default",
  [StatusColor.Failed]: "bg-content-status-failed",
  [StatusColor.Progress]: "bg-content-status-progress",
  [StatusColor.Review]: "bg-content-status-review",

  [TextColor.Destructive]: "bg-content-text-destructive",
  [TextColor.Fg]: "bg-content-text-fg",
  [TextColor.Info]: "bg-content-text-info",
  [TextColor.Muted]: "bg-content-text-muted",
  [TextColor.Placeholder]: "bg-content-text-placeholder",
  [TextColor.Primary]: "bg-content-text-primary",
  [TextColor.Secondary]: "bg-content-text-secondary",
  [TextColor.Success]: "bg-content-text-success",
  [TextColor.Tertiary]: "bg-content-text-tertiary",
  [TextColor.Warning]: "bg-content-text-warning",
  [TextColor.Accent]: "bg-content-text-accent",
  [TextColor.Decorative]: "bg-content-text-decorative",
  [IconColor.Dark]: "bg-content-icon-dark",
  [OverlayColor.Default]: "bg-content-overlay-default",
  [OverlayColor.Light]: "bg-content-overlay-light",
  [OverlayColor.Heavy]: "bg-content-overlay-heavy",
  [FocusColor.Ring]: "bg-content-focus-ring",
  [LinkColor.Default]: "bg-content-link-default",
  [LinkColor.Hover]: "bg-content-link-hover",
  [LinkColor.Visited]: "bg-content-link-visited",
  [PaletteColor.P1]: "bg-content-palette-1",
  [PaletteColor.P2]: "bg-content-palette-2",
  [PaletteColor.P3]: "bg-content-palette-3",
  [PaletteColor.P4]: "bg-content-palette-4",
  [PaletteColor.P5]: "bg-content-palette-5",
  [PaletteColor.P6]: "bg-content-palette-6",
  [PaletteColor.P7]: "bg-content-palette-7",
  [PaletteColor.P8]: "bg-content-palette-8",
  [PaletteColor.P9]: "bg-content-palette-9",
  [PaletteColor.P10]: "bg-content-palette-10",
  [PaletteColor.P11]: "bg-content-palette-11",
  [PaletteColor.P12]: "bg-content-palette-12",
  [PaletteColor.Orange]: "bg-content-palette-orange",
  [PaletteColor.Blue]: "bg-content-palette-blue",
  [PaletteColor.Green]: "bg-content-palette-green",
  [PaletteColor.Purple]: "bg-content-palette-purple",
  [PaletteColor.Pink]: "bg-content-palette-pink",
  [PaletteColor.Yellow]: "bg-content-palette-yellow",
  [PaletteColor.Teal]: "bg-content-palette-teal",
  [PaletteColor.Red]: "bg-content-palette-red",
  [SkeletonColor.Base]: "bg-content-skeleton-base",
  [SkeletonColor.Shimmer]: "bg-content-skeleton-shimmer",
  [TooltipColor.Bg]: "bg-content-tooltip-bg",
  [TooltipColor.Text]: "bg-content-tooltip-text",
  [CodeColor.Bg]: "bg-content-code-bg",
  [CodeColor.Text]: "bg-content-code-text",
  [CodeColor.Border]: "bg-content-code-border",
  [ScrollbarColor.Track]: "bg-content-scrollbar-track",
  [ScrollbarColor.Thumb]: "bg-content-scrollbar-thumb",
  [ScrollbarColor.ThumbHover]: "bg-content-scrollbar-thumb-hover",
  [SelectionColor.Bg]: "bg-content-selection-bg",
  [SelectionColor.Text]: "bg-content-selection-text",
};

const borderColorMap: Record<BorderColor, string> = {
  [BorderColor.CardElevated]: "border-content-bg-card-elevated",
  [BorderColor.Active]: "border-content-border-active",
  [BorderColor.Default]: "border-content-border-default",
  [BorderColor.Disabled]: "border-content-border-disabled",
  [BorderColor.Error]: "border-content-border-error",
  [BorderColor.Focus]: "border-content-border-focus",
  [BorderColor.Hover]: "border-content-border-hover",
  [BorderColor.Strong]: "border-content-border-strong",
  [BorderColor.Subtle]: "border-content-border-subtle",
  [BorderColor.Success]: "border-content-border-success",
  [BorderColor.Warning]: "border-content-border-warning",
  [BorderColor.Input]: "border-content-border-input",
  [BorderColor.InputHover]: "border-content-border-input-hover",
  [BorderColor.InputFocus]: "border-content-border-input-focus",
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
  if (
    isEnumValue(color, BrandColor) ||
    isEnumValue(color, SemanticColor) ||
    isEnumValue(color, ActionColor)
  ) {
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
