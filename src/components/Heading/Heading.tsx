import type { FC, HTMLAttributes } from "react";
import { TextVariant } from "@/types";
import HeadingLevel from "@/types/heading";
import { textStyles } from "@/styles/text";
import clsx from "clsx";

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
        "text-content-text-primary",
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
