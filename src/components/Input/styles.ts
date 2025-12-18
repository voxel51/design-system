import { textStyles, textStylesStep } from "@/styles/text";
import { Size, TextVariant } from "@/types";
import clsx from "clsx";

export const sizeStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: clsx("py-2", "text-sm/5"),
  [Size.Md]: clsx("py-2.25", "text-md/5"),
  [Size.Lg]: clsx("py-2.5", "text-lg/5"),
};

export const labelTextStyles: Partial<Record<Size, string | null>> = {
  [Size.Sm]: textStyles(TextVariant.Sm),
  [Size.Md]: textStyles(TextVariant.Md),
  [Size.Lg]: textStyles(TextVariant.Lg),
};

export const secondaryLabelTextStyles: Partial<Record<Size, string | null>> = {
  [Size.Sm]: textStylesStep(TextVariant.Sm, -1),
  [Size.Md]: textStylesStep(TextVariant.Md, -1),
  [Size.Lg]: textStylesStep(TextVariant.Lg, -1),
};

export const iconPaddingStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: "pl-2.5",
  [Size.Md]: "pl-2.75",
  [Size.Lg]: "pl-3",
};

export const iconSizeStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: "w-3.5 h-3.5",
  [Size.Md]: "w-3.75 h-3.75",
  [Size.Lg]: "w-4 h-4",
};

export const paddingLeftStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: "pl-7.5",
  [Size.Md]: "pl-7.75",
  [Size.Lg]: "pl-8",
};
