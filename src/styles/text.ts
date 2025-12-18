import { TextVariant } from "@/types";

export const TEXT_STYLES: Record<TextVariant, string> = {
  [TextVariant.Xxs]: "text-xxs/4",
  [TextVariant.Xs]: "text-xs/5",
  [TextVariant.Sm]: "text-sm/6",
  [TextVariant.Md]: "text-md/7",
  [TextVariant.Lg]: "text-lg/9",
  [TextVariant.Xl]: "text-xl/11",
  [TextVariant.Xxl]: "text-xxl/13",
  [TextVariant.Label]: "text-xs/5 text-bold uppercase",
  [TextVariant.Caption]: "text-xs/5 text-content-text-tertiary",
};

export const textStyles = (variant: TextVariant): string | null => {
  if (!variant) return null;
  return TEXT_STYLES[variant];
};

/**
 * Get the text style for a variant minus the given number of
 * steps - for example with a steps of -1, XL -> Lg, Sm -> Xs, etc.
 * bottoms out at the lowest variant, and tops out at the highest variant.
 * @param variant
 * @param steps
 * @returns
 */
export function textStylesStep(
  variant: TextVariant,
  steps: number
): string | null {
  const variants = Object.values(TextVariant);
  const variantIndex = variants.indexOf(variant);

  const targetIndex = () => {
    const targetIndex = variantIndex + steps;
    if (targetIndex <= 0) return 0;
    if (targetIndex >= variants.length) return variants.length - 1;
    return targetIndex;
  };

  const targetVariant = variants[targetIndex()];
  return textStyles(targetVariant);
}
