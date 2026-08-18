import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, resolving Tailwind conflicts left-to-right.
 *
 * The last conflicting utility wins, so a `className` passed by a caller
 * overrides the component's own default (`cn("p-2", "p-4")` → `"p-4"`).
 * Falsy values are dropped.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
