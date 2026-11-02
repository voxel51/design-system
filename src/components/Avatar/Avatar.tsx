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
  /** What picks the colour, such as an email; defaults to the initials. */
  colorKey?: string;
  /** Rounded square instead of a circle, for a group rather than a person. */
  square?: boolean;
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

type Tier = "pale" | "mid" | "deep";
type Shade = readonly [lightness: number, chroma: number];

// Fill and initials per tier and theme (OKLCH), each pair at 4.5:1 or more.
// Mixing tiers keeps neighbours apart even when their hues are close.
const TIERS: Record<"light" | "dark", Record<Tier, readonly [Shade, Shade]>> = {
  light: {
    pale: [
      [0.93, 0.05],
      [0.42, 0.13],
    ],
    mid: [
      [0.82, 0.1],
      [0.3, 0.1],
    ],
    deep: [
      [0.5, 0.13],
      [0.98, 0.015],
    ],
  },
  dark: {
    pale: [
      [0.82, 0.09],
      [0.27, 0.08],
    ],
    mid: [
      [0.52, 0.12],
      [0.98, 0.02],
    ],
    deep: [
      [0.36, 0.1],
      [0.9, 0.07],
    ],
  },
};

// Twenty named colours: hue, tier and an optional chroma scale for the
// earthy ones (brown, brass, steel).
const PALETTE: readonly (readonly [
  hue: number,
  tier: Tier,
  chroma?: number,
])[] = [
  [25, "deep"], // dark red
  [25, "mid"], // red
  [45, "pale"], // peach
  [55, "mid"], // pumpkin
  [55, "deep", 0.6], // brown
  [88, "pale"], // gold
  [90, "mid", 0.75], // brass
  [150, "deep"], // forest
  [150, "mid"], // green
  [170, "pale"], // seafoam
  [195, "mid"], // teal
  [235, "deep", 0.55], // steel
  [245, "pale"], // cornflower
  [260, "mid"], // blue
  [268, "deep"], // navy
  [295, "pale"], // lavender
  [305, "mid"], // purple
  [330, "deep"], // plum
  [345, "mid"], // magenta
  [5, "pale"], // pink
];

const hashOf = (key: string): number => {
  let hash = 0x811c9dc5;
  for (const char of key) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
};

// A stable colour per key: the same person keeps their colour everywhere
const colorVars = (key: string): CSSProperties => {
  const [hue, tier, scale = 1] = PALETTE[hashOf(key) % PALETTE.length];
  const shade = ([l, c]: Shade): string => `oklch(${l} ${c * scale} ${hue})`;
  const [lightBg, lightFg] = TIERS.light[tier];
  const [darkBg, darkFg] = TIERS.dark[tier];
  return {
    "--avatar-bg": shade(lightBg),
    "--avatar-fg": shade(lightFg),
    "--avatar-bg-dark": shade(darkBg),
    "--avatar-fg-dark": shade(darkFg),
  } as CSSProperties;
};

const tintStyles = cn(
  "bg-(--avatar-bg) text-(--avatar-fg)",
  "dark:bg-(--avatar-bg-dark) dark:text-(--avatar-fg-dark)"
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
 * <Avatar name="Ada Lovelace" colorKey={user.email} />
 * ```
 *
 * @param name The person's name: it makes the initials and the accessible label.
 * @param src Image URL. Initials show when it is missing.
 * @param size `"sm"` (20px), `"md"` (24px) or `"lg"` (32px). Defaults to `"md"`.
 * @param showName Shows the name beside the avatar (body text, truncating).
 * @param tone `"auto"` (default): initials on one of twenty tuned colours
 *  picked from `colorKey`, the same for a key everywhere; `"neutral"`: on the
 *  nested-card fill.
 * @param icon Shown in place of the initials when there is no image, on the
 *  neutral fill: a person not known yet (an invite) or not a person (a group).
 * @param colorKey What picks the colour: a stable id such as the email.
 *  Defaults to the initials.
 * @param square Rounded square instead of a circle, for a group.
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
  colorKey,
  square = false,
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
        radiusStyles(square ? Radius.Md : Radius.Full),
        neutral && bgColorClass(BackgroundColor.CardNested),
        neutral && textColorClass(TextColor.Secondary),
        !neutral && tintStyles,
        sizeStyles[size],
        !showName && className
      )}
      {...(!showName && props)}
      style={{
        ...(!neutral && colorVars(colorKey ?? initials(name))),
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
