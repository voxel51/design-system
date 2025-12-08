/**
 * Helper methods for converting explicit CSS colors into
 * their corresponding tailwind class to support overriding
 * theme defaults.
 */

import { BackgroundColor, TextColor } from "@/types";

type ColorEnumType = typeof TextColor | typeof BackgroundColor;

/**
 * Checks if the color is a valid tailwind class based on whether
 * the class exists in the enum representing the color type.
 * @param color - The color to check.
 * @param enumType - The enum type to check.
 * @returns True if the color is a valid tailwind class, false otherwise.
 */
function isTailwindClass(color: string, enumType: ColorEnumType): boolean {
  return Object.values(enumType).includes(color);
}

/**
 * Converts a text color to a tailwind class.
 * @param color - The color to convert to a tailwind class.
 * @returns The tailwind class for the color.
 */
export function text(color: string): string | null {
  if (!color) return null;
  if (isTailwindClass(color, TextColor)) {
    return color;
  }
  return `text-[${color}]`;
}

/**
 * Converts a background color to a tailwind class.
 * @param color - The color to convert to a tailwind class.
 * @returns The tailwind class for the color.
 */
export function bg(color: string): string | null {
  if (!color) return null;
  if (isTailwindClass(color, BackgroundColor)) {
    return color;
  }
  return `bg-[${color}]`;
}
