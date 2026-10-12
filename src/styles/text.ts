import { TextColor, TextVariant, Variant } from "@/types";

// Each role utility (`text-heading-sm`) carries size, leading and weight from
// the theme, so a role never needs a `/leading` suffix or a `font-*` class.
/**
 * The caption role's size alone. `TEXT_STYLES[TextVariant.Caption]` also
 * carries the tertiary colour Figma binds to captions; components that set
 * their own colour (Button, Pill) take the size from here instead.
 */
export const CAPTION_SIZE = "text-caption";

export const TEXT_STYLES: Record<TextVariant, string> = {
  [TextVariant.HeadingXl]: "text-heading-xl",
  [TextVariant.HeadingLg]: "text-heading-lg",
  [TextVariant.HeadingMd]: "text-heading-md",
  [TextVariant.HeadingSm]: "text-heading-sm",
  [TextVariant.HeadingXs]: "text-heading-xs",
  [TextVariant.BodyPrimary]: "text-body-primary",
  [TextVariant.BodySecondary]: "text-body-secondary",
  [TextVariant.BodyTertiary]: "text-body-tertiary",
  [TextVariant.Label]: "text-label uppercase",
  [TextVariant.Caption]: `${CAPTION_SIZE} text-content-text-tertiary`,
  [TextVariant.CodePrimary]: "text-code-primary font-mono",
  [TextVariant.CodeSecondary]: "text-code-secondary font-mono",

  // The deprecated size-only scale keeps its exact classes so nothing moves
  // for a consumer that has not migrated.
  [TextVariant.Xxs]: "text-xxs/4",
  [TextVariant.Xs]: "text-xs/5",
  [TextVariant.Sm]: "text-sm/5",
  [TextVariant.Md]: "text-md/5",
  [TextVariant.Lg]: "text-lg/5",
  [TextVariant.Xl]: "text-xl/11",
  [TextVariant.Xxl]: "text-xxl/13",
};

export const textStyles = (variant: TextVariant): string | null => {
  if (!variant) return null;
  return TEXT_STYLES[variant];
};

export const textColor = (variant: Variant): TextColor | undefined => {
  if (!variant) {
    return;
  }

  switch (variant) {
    case Variant.Primary:
      return TextColor.Primary;
    case Variant.Secondary:
      return TextColor.Secondary;
    case Variant.Success:
      return TextColor.Success;
    case Variant.Danger:
      return TextColor.Failure;
    case Variant.Icon:
      return TextColor.Primary;
    default:
      return TextColor.Primary;
  }
};
