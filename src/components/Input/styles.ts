import clsx from "clsx";

import { TEXT_STYLES } from "@/styles/text";
import { Size, TextVariant } from "@/types";

// Figma TextInput: Small is 28px tall with 6/10 padding and a 12/16 label,
// Medium 36px with 8/12 and 14/20, Large 40px with 10/12 and 14/20.
export type InputSize = Size.Sm | Size.Md | Size.Lg;

/**
 * Figma draws three input sizes. `size` still accepts the full scale for
 * compatibility, so Xs and Xl fold onto the nearest drawn size rather than
 * rendering with no height, text size or padding.
 */
export const toInputSize = (size: Size): InputSize => {
  if (size === Size.Xs) return Size.Sm;
  if (size === Size.Xl) return Size.Lg;
  return size;
};

export const sizeStyles: Record<InputSize, string> = {
  [Size.Sm]: clsx("py-1.5 h-7", TEXT_STYLES[TextVariant.BodyTertiary]),
  [Size.Md]: clsx("py-2 h-9", TEXT_STYLES[TextVariant.BodySecondary]),
  [Size.Lg]: clsx("py-2.5 h-10", TEXT_STYLES[TextVariant.BodySecondary]),
};

export const paddingStyles: Record<InputSize, string> = {
  [Size.Sm]: "px-2.5",
  [Size.Md]: "px-3",
  [Size.Lg]: "px-3",
};

// The leading icon sits at the field's side padding; the text starts 8px
// after it.
export const iconPaddingStyles: Record<InputSize, string> = {
  [Size.Sm]: "pl-2.5",
  [Size.Md]: "pl-3",
  [Size.Lg]: "pl-3",
};

export const iconSizeStyles: Record<InputSize, string> = {
  [Size.Sm]: "size-3.5",
  [Size.Md]: "size-4",
  [Size.Lg]: "size-4.5",
};

export const iconSizes: Record<InputSize, number> = {
  [Size.Sm]: 14,
  [Size.Md]: 16,
  [Size.Lg]: 18,
};

export const paddingLeftStyles: Record<InputSize, string> = {
  [Size.Sm]: "pl-8",
  [Size.Md]: "pl-9",
  [Size.Lg]: "pl-[38px]",
};

export const numberInputStyles = clsx(
  "appearance-none",
  "[&::-webkit-outer-spin-button]:appearance-none",
  "[&::-webkit-inner-spin-button]:appearance-none",
  "[&::-webkit-inner-spin-button]:m-0",
  "[&::-webkit-outer-spin-button]:m-0",
  "[-moz-appearance:textfield]"
);
