import { TextColor, TextVariant, Variant } from "@/types";

export const TEXT_STYLES: Record<TextVariant, string> = {
  [TextVariant.Xxs]: "text-xxs/4",
  [TextVariant.Xs]: "text-xs/5",
  [TextVariant.Sm]: "text-sm/6",
  [TextVariant.Md]: "text-md/7",
  [TextVariant.Lg]: "text-lg/9",
  [TextVariant.Xl]: "text-xl/11",
  [TextVariant.Xxl]: "text-xxl/13",
  [TextVariant.Label]: "text-xs/5 font-bold uppercase",
  [TextVariant.Caption]: "text-xs/5 text-content-text-tertiary",
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
