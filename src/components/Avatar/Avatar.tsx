import type { FC, HTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  Radius,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export type AvatarSize = `${Size.Sm | Size.Md | Size.Lg}`;

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  src?: string;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, string> = {
  [Size.Sm]: cn("size-5", textStyles(TextVariant.Caption)),
  [Size.Md]: cn("size-6", textStyles(TextVariant.BodyTertiary)),
  [Size.Lg]: cn("size-8", textStyles(TextVariant.BodySecondary)),
};

const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

/**
 * A round picture of a person, falling back to their initials when there is
 * no image.
 *
 * @example
 * ```tsx
 * <Avatar name="Ada Lovelace" src={user.photoUrl} size="sm" />
 * ```
 *
 * @param name The person's name: it makes the initials and the accessible label.
 * @param src Image URL. Initials show when it is missing.
 * @param size `"sm"` (20px), `"md"` (24px) or `"lg"` (32px). Defaults to `"md"`.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Avatar: FC<AvatarProps> = ({
  name,
  src,
  size = Size.Md,
  className,
  ...props
}) => (
  <span
    role="img"
    aria-label={name}
    className={cn(
      "inline-flex shrink-0 select-none items-center justify-center overflow-hidden",
      radiusStyles(Radius.Full),
      bgColorClass(BackgroundColor.CardNested),
      textColorClass(TextColor.Secondary),
      sizeStyles[size],
      className
    )}
    {...props}
  >
    {src ? (
      <img src={src} alt="" className="size-full object-cover" />
    ) : (
      initials(name)
    )}
  </span>
);

Avatar.displayName = "Avatar";
