import type { FC, HTMLAttributes } from "react";
import clsx from "clsx";

export type HeadingVariant = "h1" | "h2" | "h3" | "h4";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  variant?: HeadingVariant;
}

const elementMap: Record<HeadingVariant, FC<HeadingProps>> = {
  h1: ({ children, ...props }: HeadingProps) => <h1 {...props}>{children}</h1>,
  h2: ({ children, ...props }: HeadingProps) => <h2 {...props}>{children}</h2>,
  h3: ({ children, ...props }: HeadingProps) => <h3 {...props}>{children}</h3>,
  h4: ({ children, ...props }: HeadingProps) => <h4 {...props}>{children}</h4>,
};

const variantStyles: Record<HeadingVariant, string> = {
  h1: clsx("text-2xl/5"),
  h2: clsx("text-xl/5"),
  h3: clsx("text-lg/5"),
  h4: clsx("text-base/5"),
};

export const Heading: FC<HeadingProps> = ({
  variant = "h1",
  className,
  children,
  ...props
}: HeadingProps) => {
  const Element = elementMap[variant];

  return (
    <Element
      className={clsx(
        "text-content-text-primary",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Element>
  );
};

Heading.displayName = "Heading";
