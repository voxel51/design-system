import type { AnchorHTMLAttributes, FC } from "react";

import { TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  accent?: boolean;
  truncate?: boolean;
}

/**
 * An inline link inside running text, such as "Learn more" in a sentence or a
 * URL in a {@link MetaList}. Takes the size of the text around it.
 *
 * @example
 * ```tsx
 * <Text variant="body-secondary">
 *   Read the <TextLink href={DOCS} external>docs</TextLink>.
 * </Text>
 * ```
 *
 * @param href Where the link goes.
 * @param external Opens in a new tab, without a referrer.
 * @param accent Draws the link in the accent text colour instead of the surrounding colour, underlined only on hover.
 * @param truncate Keeps the link on one line, cut with an ellipsis.
 * @param className `class` overrides to apply to the link.
 * @param props Additional HTML anchor properties.
 */
export const TextLink: FC<TextLinkProps> = ({
  external = false,
  accent = false,
  truncate = false,
  className,
  children,
  ...props
}) => (
  <a
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    className={cn(
      "underline-offset-2",
      accent
        ? cn(textColorClass(TextColor.Accent), "hover:underline")
        : "text-inherit underline",
      truncate ? "block min-w-0 truncate" : "[overflow-wrap:anywhere]",
      className
    )}
    {...props}
  >
    {children}
  </a>
);

TextLink.displayName = "TextLink";
