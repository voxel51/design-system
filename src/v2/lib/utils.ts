import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The design system's font-size scale, named rather than numbered.
 *
 * tailwind-merge has to be told these exist. It resolves conflicts by parsing
 * class names, and `text-*` is ambiguous — it is the prefix for both font size
 * and text colour. Given only its built-in scale (`text-sm`, `text-lg`, …) it
 * reads `text-body-sm` as a colour, decides it conflicts with `text-foreground`
 * later in the list, and drops it.
 *
 * That failure is silent and total: `cn("text-body-sm", "text-foreground")`
 * returns just `text-foreground`, so the element renders at the inherited size.
 * It cost a 2px height difference on the dataset nav that looked like a padding
 * bug, and it applies to every component that sets a size and a colour in one
 * `cn` call — which is most of them.
 */
const FONT_SIZES = [
  "display",
  "title",
  "heading",
  "subheading",
  "heading-small",
  "body",
  "body-sm",
  "meta",
  "caption",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
  },
});

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
