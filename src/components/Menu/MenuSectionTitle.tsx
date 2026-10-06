import type { FC, HTMLAttributes } from "react";

import { Text } from "@/components/Text";
import { TextColor, TextVariant } from "@/types";
import { cn } from "@/util/classes";

/**
 * Props for {@link MenuSectionTitle}.
 */
export interface MenuSectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  /** The section title text. Rendered as an uppercase muted label. */
  children: string;
}

/**
 * A non-interactive section title within a menu (e.g. {@link Dropdown}).
 * Renders as an uppercase label above a group of items.
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<DropdownTrigger>Open</DropdownTrigger>}>
 *   <MenuSectionTitle>Actions</MenuSectionTitle>
 *   <MenuIconTextItem icon={<EditIcon />} text="Edit" />
 * </Dropdown>
 * ```
 *
 * @param children The section title text.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const MenuSectionTitle: FC<MenuSectionTitleProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      role="presentation"
      // Figma ActionMenu title: a 28px row (6/8 padding around a 16px label
      // line), then 6px before the first item
      className={cn("px-2 pt-1.5 pb-3", className)}
      {...props}
    >
      {/* Block, so the label keeps its own 16px line instead of the
          parent's taller line box */}
      <Text
        variant={TextVariant.Label}
        color={TextColor.Secondary}
        className="block"
      >
        {children}
      </Text>
    </div>
  );
};

MenuSectionTitle.displayName = "MenuSectionTitle";
