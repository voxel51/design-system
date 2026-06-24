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
}

export type Color =
  | ActionColor
  | BackgroundColor
  | BrandColor
  | IconColor
  | SemanticColor
  | StatusColor
  | TextColor;

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
