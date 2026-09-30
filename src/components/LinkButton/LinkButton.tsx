import { Button as HeadlessButton } from "@headlessui/react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, FC } from "react";

import { TEXT_STYLES } from "@/styles/text";
import { Size, TextColor, textColorClass, TextVariant } from "@/types";
import { cn } from "@/util/classes";

type LinkButtonSize = `${Exclude<Size, Size.Xl>}`;

export interface LinkButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> {
  /** Renders a real anchor so the link is navigable, copyable and openable in a new tab. */
  href?: string;
  /** Matches the surrounding type: 12/16, 14/20, 14/20 and 15/20 for Xs, Sm, Md and Lg. */
  size?: LinkButtonSize;
}

// Figma LinkButton: medium 12/16 at X-small, medium 14/20 at Small and
// Medium, regular 15/20 at Large, all text/primary.
const sizeStyles: Record<LinkButtonSize, string> = {
  [Size.Xs]: TEXT_STYLES[TextVariant.HeadingXs],
  [Size.Sm]: TEXT_STYLES[TextVariant.HeadingSm],
  [Size.Md]: TEXT_STYLES[TextVariant.HeadingSm],
  [Size.Lg]: TEXT_STYLES[TextVariant.BodyPrimary],
};

/**
 * An inline, hyperlink-style button for navigation within running text.
 *
 * Figma's hover state is visually identical to rest; the underline on hover
 * is the one affordance added here so the control reads as interactive.
 *
 * @example
 * ```tsx
 * <Text>
 *   Something went wrong. <LinkButton onClick={retry}>Try again</LinkButton>
 * </Text>
 * ```
 *
 * @param href When set, renders an anchor instead of a button.
 * @param size The type size to match. See {@link Size}.
 * @param className `class` overrides to apply to the component.
 * @param children The link text.
 * @param props Additional HTML properties to apply to the component.
 */
export const LinkButton: FC<LinkButtonProps> = ({
  href,
  target,
  rel,
  size = Size.Md,
  className,
  children,
  ...props
}) => {
  const classes = cn(
    "inline cursor-pointer bg-transparent p-0 align-baseline",
    "underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline",
    textColorClass(TextColor.Primary),
    sizeStyles[size],
    className
  );

  if (href && !props.disabled) {
    const { type: _type, ...anchorProps } = props;
    return (
      <a
        className={classes}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noreferrer" : undefined)}
        {...(anchorProps as unknown as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <HeadlessButton type="button" className={classes} {...props}>
      {children}
    </HeadlessButton>
  );
};

LinkButton.displayName = "LinkButton";
