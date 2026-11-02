import {
  type CSSProperties,
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useState,
} from "react";

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
  /** Shown in place of the initials (an invite, a group), on the neutral fill. */
  icon?: ReactNode;
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

// Twelve hues that stay distinct as pale tints in both themes; yellow-greens
// and browns are left out because they read muddy when pale.
const HUES = [5, 25, 45, 140, 170, 195, 215, 240, 265, 290, 315, 340];

// A stable hue per name: the same person keeps their colour everywhere.
const nameHue = (name: string): number => {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return HUES[Math.abs(hash) % HUES.length];
};

// A pale tint with deep initials of the same hue, reversed in the dark theme
const tintStyles = cn(
  "bg-[hsl(var(--avatar-hue)_75%_91%)] text-[hsl(var(--avatar-hue)_60%_32%)]",
  "dark:bg-[hsl(var(--avatar-hue)_40%_25%)] dark:text-[hsl(var(--avatar-hue)_85%_82%)]"
);

/**
 * A round picture of a person, falling back to their initials when there is
 * no image or it fails to load.
 *
 * @example
 * ```tsx
 * <Avatar name="Ada Lovelace" src={user.photoUrl} size="sm" />
 * <Avatar name={run.runBy.name} size="sm" showName />
 * <Avatar name="Ada Lovelace" tone="neutral" />
 * <Avatar name="ada@example.com" icon={<MailOutlineIcon size="md" />} />
 * ```
 *
 * @param name The person's name: it makes the initials and the accessible label.
 * @param src Image URL. Initials show when it is missing.
 * @param size `"sm"` (20px), `"md"` (24px) or `"lg"` (32px). Defaults to `"md"`.
 * @param showName Shows the name beside the avatar (body text, truncating).
 * @param tone `"auto"` (default): initials on a pale tint of one of twelve
 *  hues picked from the name, the same for a name everywhere; `"neutral"`: on
 *  the nested-card fill.
 * @param icon Shown in place of the initials when there is no image, on the
 *  neutral fill: a person not known yet (an invite) or not a person (a group).
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Avatar: FC<AvatarProps> = ({
  name,
  src,
  size = Size.Md,
  showName = false,
  tone = "auto",
  icon,
  className,
  ...props
}) => {
  const [failedSrc, setFailedSrc] = useState<string>();
  const image = src && src !== failedSrc ? src : undefined;
  const neutral = tone === "neutral" || Boolean(image) || Boolean(icon);
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
        !neutral && tintStyles,
        sizeStyles[size],
        !showName && className
      )}
      {...(!showName && props)}
      style={{
        ...(!neutral && ({ "--avatar-hue": nameHue(name) } as CSSProperties)),
        ...(!showName && props.style),
      }}
    >
      {image ? (
        // Google-hosted profile pictures refuse requests with a referrer
        <img
          src={image}
          alt=""
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => setFailedSrc(image)}
        />
      ) : (
        (icon ?? initials(name))
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
