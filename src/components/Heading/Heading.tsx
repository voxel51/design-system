import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { textStyles } from "@/styles/text";
import { TextColor, textColorClass, TextVariant } from "@/types";
import HeadingLevel from "@/types/heading";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

const elementMap: Record<HeadingLevel, FC<HeadingProps>> = {
  h1: ({ children, ...props }: HeadingProps) => <h1 {...props}>{children}</h1>,
  h2: ({ children, ...props }: HeadingProps) => <h2 {...props}>{children}</h2>,
  h3: ({ children, ...props }: HeadingProps) => <h3 {...props}>{children}</h3>,
  h4: ({ children, ...props }: HeadingProps) => <h4 {...props}>{children}</h4>,
};

const variantStyles: Record<HeadingLevel, string> = {
  h1: clsx(textStyles(TextVariant.Xxl), "text-bold"),
  h2: clsx(textStyles(TextVariant.Xl), "text-semibold"),
  h3: clsx(textStyles(TextVariant.Lg), "text-semibold"),
  h4: clsx(textStyles(TextVariant.Md)),
};

/**
 * A basic heading component.
 *
 * This component leverages standard heading tags `h1`, `h2`, etc.
 *
 * @example
 * ```tsx
 * <Heading level={HeadingLevel.H2}>
 *   Heading content here
 * </Heading>
 * ```
 *
 * @param level Heading level to use. See {@link HeadingLevel}.
 * @param className `class` overrides to apply to the component.
 * @param children The content of the heading.
 * @param props Additional HTML properties to apply to the component.
 */
export const Heading: FC<HeadingProps> = ({
  level = HeadingLevel.H1,
  className,
  children,
  ...props
}: HeadingProps) => {
  const Element = elementMap[level];

  return (
    <Element
      className={clsx(
        textColorClass(TextColor.Primary),
        variantStyles[level],
        className
      )}
      {...props}
    >
      {children}
    </Element>
  );
};

Heading.displayName = "Heading";
