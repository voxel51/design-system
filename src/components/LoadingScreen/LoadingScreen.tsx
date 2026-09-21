import type { FC, HTMLAttributes, ReactNode } from "react";

import { LoadingDots } from "@/components/LoadingDots";
import { Stack } from "@/components/Stack";
import { Align, Justify, TextColor, TextVariant } from "@/types";
import { cn } from "@/util/classes";

export interface LoadingScreenProps extends HTMLAttributes<HTMLDivElement> {
  color?: TextColor;
  text: ReactNode;
  variant?: TextVariant;
}

/**
 * A region that is still filling: the whole area, with what it is waiting on
 * centered in it.
 *
 * Where {@link LoadingDots} marks a piece of text as resolving, this stands in
 * for content that has not arrived. Two of these at two sizes read as two
 * different screens, so a product gives every wait the same one.
 *
 * @example
 * ```tsx
 * <LoadingScreen text="Loading" />
 * ```
 *
 * @param className `class` overrides to apply to the component.
 * @param color Text color. See {@link TextColor}.
 * @param text What the region is waiting on.
 * @param variant Text size. See {@link TextVariant}.
 * @param props Additional HTML properties to apply to the component.
 */
export const LoadingScreen: FC<LoadingScreenProps> = ({
  className,
  color = TextColor.Secondary,
  text,
  variant = TextVariant.Xl,
  ...props
}) => (
  <Stack
    align={Align.Center}
    justify={Justify.Center}
    className={cn("h-full w-full break-all px-8", className)}
    {...props}
  >
    <LoadingDots color={color} text={text} variant={variant} />
  </Stack>
);

LoadingScreen.displayName = "LoadingScreen";
