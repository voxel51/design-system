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

// A stable hue per name at a fixed saturation and lightness; the initials
// take white or near-black, whichever contrasts more with that hue's
// luminance (yellows and cyans read light even at 42% lightness).
const nameFill = (name: string): { backgroundColor: string; color: string } => {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  const hue = Math.abs(hash) % 360;
  const [s, l] = [0.45, 0.42];
  const channel = (n: number): number => {
    const k = (n + hue / 30) % 12;
    const v =
      l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * channel(0) + 0.7152 * channel(8) + 0.0722 * channel(4);
  // contrast with white vs with #111 (luminance ~0.0056)
  const light = 1.05 / (luminance + 0.05) >= (luminance + 0.05) / 0.0556;
  return {
    backgroundColor: `hsl(${hue} 45% 42%)`,
    color: light ? "#fff" : "#111",
  };
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
        neutral && textColorClass(TextColor.Secondary),
        sizeStyles[size],
        !showName && className
      )}
      {...(!showName && props)}
      style={{
        ...(!neutral && nameFill(name)),
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
