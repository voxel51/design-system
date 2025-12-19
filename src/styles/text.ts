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
