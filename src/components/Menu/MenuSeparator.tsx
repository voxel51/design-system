import type { FC, HTMLAttributes } from "react";

import { bgColorClass, TextColor } from "@/types";
import { cn } from "@/util/classes";

/**
 * Props for {@link MenuSeparator}. Accepts any standard div HTML attributes.
 */
export type MenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

/**
 * A horizontal rule separator within a menu (e.g. {@link Dropdown}).
 * Used to visually divide groups of items.
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<DropdownTrigger>Open</DropdownTrigger>}>
 *   <MenuTextItem onClick={() => {}}>First group</MenuTextItem>
 *   <MenuSeparator />
 *   <MenuTextItem onClick={() => {}}>Second group</MenuTextItem>
 * </Dropdown>
 * ```
 *
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const MenuSeparator: FC<MenuSeparatorProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      role="separator"
      className={cn(
        "my-1 h-px",
        bgColorClass(TextColor.Placeholder),
        className
      )}
      {...props}
    />
  );
};

MenuSeparator.displayName = "MenuSeparator";
