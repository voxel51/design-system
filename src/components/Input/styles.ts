import clsx from "clsx";

import { TEXT_STYLES } from "@/styles/text";
import { Size, TextVariant } from "@/types";

// Figma TextInput: Small is 28px tall with 6/10 padding and a 12/16 label,
// Medium 36px with 8/12 and 14/20, Large 40px with 10/12 and 14/20.
export const sizeStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: clsx("py-1.5 h-7", TEXT_STYLES[TextVariant.BodyTertiary]),
  [Size.Md]: clsx("py-2 h-9", TEXT_STYLES[TextVariant.BodySecondary]),
  [Size.Lg]: clsx("py-2.5 h-10", TEXT_STYLES[TextVariant.BodySecondary]),
};

export const paddingStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: "px-2.5",
  [Size.Md]: "px-3",
  [Size.Lg]: "px-3",
};

// The leading icon sits at the field's side padding; the text starts 8px
// after it.
export const iconPaddingStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: "pl-2.5",
  [Size.Md]: "pl-3",
  [Size.Lg]: "pl-3",
};

export const iconSizeStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: "size-3.5",
  [Size.Md]: "size-4",
  [Size.Lg]: "size-4.5",
};

export const iconSizes: Partial<Record<Size, number>> = {
  [Size.Sm]: 14,
  [Size.Md]: 16,
  [Size.Lg]: 18,
};

export const paddingLeftStyles: Partial<Record<Size, string>> = {
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
