import clsx from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { typography } from "@/theme/tokens/typography";

/**
 * Our font-size utility names, as Tailwind emits them from `--text-*`.
 *
 * tailwind-merge only knows Tailwind's stock size scale, and `text-*` is
 * ambiguous — it is the prefix for both font size and text colour. Anything it
 * doesn't recognise as a size it treats as a colour, so `cn(colourClass,
 * textStyles(variant))` would drop the colour as a conflicting `text-*`. That
 * silently loses the colour: `text-body-secondary` and
 * `text-content-text-secondary` look like the same class group to it.
 *
 * Derived from the tokens rather than hand-listed, so a new size or a Figma
 * rename can't reintroduce the bug. `xs`/`sm`/`md`/`lg`/`xl` happen to overlap
 * with the stock scale and are already safe; `xxs`, `xxl`, and every role name
 * are not.
 */
const fontSizeNames = [
  ...Object.keys(typography.fontSize),
  ...Object.keys(typography.role),
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: fontSizeNames }],
    },
  },
});

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
