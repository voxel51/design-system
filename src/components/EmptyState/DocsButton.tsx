import type { FC } from "react";

import { Button, type ButtonProps } from "@/components/Button";
import { LaunchIcon } from "@/components/Icons";
import { Size, Variant } from "@/types";

export interface DocsButtonProps extends Omit<
  ButtonProps,
  "href" | "children" | "variant" | "leadingIcon" | "collapse"
> {
  /** The docs page, opened in a new tab. */
  href: string;
  /** Defaults to `"View Docs"`. */
  label?: string;
}

/**
 * The secondary "View Docs" link button of empty states, steps and toolbars:
 * it opens the docs in a new tab and drops to its icon while the enclosing
 * row is short of room.
 *
 * @example
 * ```tsx
 * <DocsButton href="https://docs.voxel51.com/teams/data_lens.html" />
 * ```
 *
 * @param href The docs page, opened in a new tab.
 * @param label The button text and accessible name. Defaults to `"View Docs"`.
 * @param size Button size. Defaults to `"sm"`.
 * @param props Additional {@link Button} properties.
 */
export const DocsButton: FC<DocsButtonProps> = ({
  href,
  label = "View Docs",
  size = Size.Sm,
  ...props
}) => (
  <Button
    variant={Variant.Secondary}
    size={size}
    href={href}
    target="_blank"
    leadingIcon={LaunchIcon}
    aria-label={label}
    collapse="auto"
    {...props}
  >
    {label}
  </Button>
);

DocsButton.displayName = "DocsButton";
