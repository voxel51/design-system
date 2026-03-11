import clsx from "clsx";

import { Size } from "@/types";

export const sizeStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: clsx("py-1.75", "text-sm/5", "h-[2rem]"),
  [Size.Md]: clsx("py-2", "text-md/5", "h-[2.25rem]"),
  [Size.Lg]: clsx("py-2.25", "text-lg/5", "h-[2.5rem]"),
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
  [Size.Md]: "pl-8",
  [Size.Lg]: "pl-8.25",
};
