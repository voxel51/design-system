import type { FC, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/util/classes";

import styles from "./LoadingDots.module.css";

export interface LoadingDotsProps extends HTMLAttributes<HTMLSpanElement> {
  /** Optional label the dots trail, e.g. the query being resolved. */
  text?: ReactNode;
}

/**
 * An inline loading indicator: an optional label followed by an animated
 * ellipsis. Where {@link Spinner} marks a region as busy, this marks a piece
 * of text as still resolving — "Searching cats…" — and sizes and colors
 * itself from the surrounding text.
 *
 * @example
 * ```tsx
 * <Text color={TextColor.Tertiary}>
 *   <LoadingDots text={query} />
 * </Text>
 * ```
 *
 * @param text Label the dots follow.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const LoadingDots: FC<LoadingDotsProps> = ({
  text,
  className,
  ...props
}) => (
  <span
    role="status"
    className={cn("inline-flex items-baseline", className)}
    {...props}
  >
    {text}
    <span aria-hidden="true" className={styles.dots} />
  </span>
);

LoadingDots.displayName = "LoadingDots";
