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

/** `"auto"`: a fill picked from the name; `"neutral"`: the nested-card fill. */
export type AvatarTone = "auto" | "neutral";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  src?: string;
  size?: AvatarSize;
  /** Shows the name beside the avatar, truncating, as in a "Run by" cell. */
  showName?: boolean;
  tone?: AvatarTone;
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

// a stable hue per name; fixed saturation and lightness keep white initials
// legible on every hue, in both themes
const nameFill = (name: string): string => {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return `hsl(${Math.abs(hash) % 360} 45% 42%)`;
};

/**
 * A round picture of a person, falling back to their initials when there is
 * no image.
 *
 * @example
 * ```tsx
 * <Avatar name="Ada Lovelace" src={user.photoUrl} size="sm" />
 * <Avatar name={run.runBy.name} size="sm" showName />
 * <Avatar name="Ada Lovelace" tone="neutral" />
 * ```
 *
 * @param name The person's name: it makes the initials and the accessible label.
 * @param src Image URL. Initials show when it is missing.
 * @param size `"sm"` (20px), `"md"` (24px) or `"lg"` (32px). Defaults to `"md"`.
 * @param showName Shows the name beside the avatar (body text, truncating).
 * @param tone `"auto"` (default): initials on a fill picked from the name, the
 *  same for a name everywhere; `"neutral"`: on the nested-card fill.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Avatar: FC<AvatarProps> = ({
  name,
  src,
  size = Size.Md,
  showName = false,
  tone = "auto",
  className,
  ...props
}) => {
  const neutral = tone === "neutral" || Boolean(src);
  const avatar = (
    <span
      role="img"
      aria-label={showName ? undefined : name}
      aria-hidden={showName || undefined}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center overflow-hidden",
        radiusStyles(Radius.Full),
        neutral && bgColorClass(BackgroundColor.CardNested),
        neutral ? textColorClass(TextColor.Secondary) : "text-white",
        sizeStyles[size],
        !showName && className
      )}
      {...(!showName && props)}
      style={{
        ...(!neutral && { backgroundColor: nameFill(name) }),
        ...(!showName && props.style),
      }}
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
  if (!showName) return avatar;
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5",
        textColorClass(TextColor.Primary),
        textStyles(TextVariant.BodySecondary),
        className
      )}
      {...props}
    >
      {avatar}
      <span className="truncate">{name}</span>
    </span>
  );
};

Avatar.displayName = "Avatar";
