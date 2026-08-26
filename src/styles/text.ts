import { TextColor, TextVariant, Variant } from "@/types";

// Sizes come from the role tier — the names Figma's text styles carry — so a
// variant renders what the design says it renders. The t-shirt scale is still
// emitted as `--text-xs` etc. for anything binding to a primitive directly.
export const TEXT_STYLES: Record<TextVariant, string> = {
  [TextVariant.Xxs]: "text-xxs/4",
  [TextVariant.Xs]: "text-caption/5", // Caption, 11px
  [TextVariant.Sm]: "text-body-tertiary/5", // Body Tertiary, 12px
  [TextVariant.Md]: "text-body-secondary/5", // Body Secondary, 14px
  [TextVariant.Lg]: "text-body-primary/5", // Body Primary, 15px
  [TextVariant.Title]: "text-heading-md/5 font-medium", // Heading Medium, 16px
  [TextVariant.Xl]: "text-xl/11",
  [TextVariant.Xxl]: "text-xxl/13",
  [TextVariant.Label]: "text-caption/5 font-bold uppercase",
  [TextVariant.Caption]: "text-caption/5 text-content-text-tertiary",
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
      return TextColor.Destructive;
    case Variant.Icon:
      return TextColor.Primary;
    default:
      return TextColor.Primary;
  }
};
