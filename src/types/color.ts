/**
 * Tailwind classes for text colors
 */
export enum TextColor {
  Fg = "text-content-text-fg",
  Primary = "text-content-text-primary",
  Secondary = "text-content-text-secondary",
  Tertiary = "text-content-text-tertiary",
  Muted = "text-content-text-muted",
}

// Allows for arbitrary string values (hex, rgb, named colors, etc.)
export type TextColorType = TextColor | string;

/**
 * Tailwind classes for background colors
 */
export enum BackgroundColor {
  Background = "bg-content-bg-background",
  Card1 = "bg-content-bg-card-1",
  Card2 = "bg-content-bg-card-2",
  CardElevated = "bg-content-bg-card-elevated",
  Muted = "bg-content-bg-muted",
  Popover = "bg-content-bg-popover",
  Secondary = "bg-content-bg-secondary",
}

// Allows for arbitrary string values (hex, rgb, named colors, etc.)
export type BackgroundColorType = BackgroundColor | string;
