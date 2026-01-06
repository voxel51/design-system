import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Helper function which aggregates and deduplicates class names.
 *
 * This method supports the same syntax as {@link clsx}; each
 * argument can be a single class or a space-delimited list of classes.
 *
 * Deduplication is handled left-to-right, so later entries will always
 * take precedence over earlier entries. TL;DR - put your overrides at the end.
 *
 * @example
 * ```typescript jsx
 *   <Button className={cn("border-1 rounded-sm", "border-0 bg-red")}>
 *       Click me
 *   </Button>
 *   // resolves to className="rounded-sm border-0 bg-red"
 * ```
 *
 * @param classes Classes to apply
 */
export const cn = (
  ...classes: (string | boolean | null | undefined)[]
): string => {
  return twMerge(clsx(...classes));
};
