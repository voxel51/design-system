/**
 * Tailwind classes for text colors
 */
export enum TextColor {
  Fg = "fg",
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
  Muted = "muted",
}

const textColorMap: Record<TextColor, string> = {
  [TextColor.Fg]: "text-content-text-fg",
  [TextColor.Primary]: "text-content-text-primary",
  [TextColor.Secondary]: "text-content-text-secondary",
  [TextColor.Tertiary]: "text-content-text-tertiary",
  [TextColor.Muted]: "text-content-text-muted",
};

export function textColorClass(color: TextColor): string {
  return textColorMap[color];
}

/**
 * Tailwind classes for background colors
 */
export enum BackgroundColor {
  Background = "background",
  Card1 = "card-1",
  Card2 = "card-2",
  CardElevated = "card-elevated",
  Muted = "muted",
  Popover = "popover",
  Secondary = "secondary",
}

const backgroundColorMap: Record<BackgroundColor, string> = {
  [BackgroundColor.Background]: "bg-content-bg-background",
  [BackgroundColor.Card1]: "bg-content-bg-card-1",
  [BackgroundColor.Card2]: "bg-content-bg-card-2",
  [BackgroundColor.CardElevated]: "bg-content-bg-card-elevated",
  [BackgroundColor.Muted]: "bg-content-bg-muted",
  [BackgroundColor.Popover]: "bg-content-bg-popover",
  [BackgroundColor.Secondary]: "bg-content-bg-secondary",
};

export function bgColorClass(color: BackgroundColor): string {
  return backgroundColorMap[color];
}
