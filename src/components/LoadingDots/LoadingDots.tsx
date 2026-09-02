import type { FC, ReactNode } from "react";

import { Text, type TextProps } from "@/components/Text";
import { cn } from "@/util/classes";

import styles from "./LoadingDots.module.css";

export interface LoadingDotsProps extends TextProps {
  /** Optional label the dots trail, e.g. the query being resolved. */
  text?: ReactNode;
}

/**
 * An inline loading indicator: an optional label followed by an animated
 * ellipsis. Where {@link Spinner} marks a region as busy, this marks a piece
 * of text as still resolving — "Searching cats…". It is a {@link Text}, so
 * `variant` and `color` size and color the label and the dots together.
 *
 * @example
 * ```tsx
 * <LoadingDots text={query} color={TextColor.Tertiary} />
 * ```
 *
 * @param text Label the dots follow.
 * @param variant Text size. See {@link TextVariant}.
 * @param color Text color. See {@link TextColor}.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const LoadingDots: FC<LoadingDotsProps> = ({
  text,
  className,
  ...props
}) => (
  <Text
    role="status"
    className={cn("inline-flex items-baseline", className)}
    {...props}
  >
    {text}
    <span aria-hidden="true" className={styles.dots} />
  </Text>
);

LoadingDots.displayName = "LoadingDots";
