import { ComboboxOption } from "@headlessui/react";
import { type FC, type MouseEvent, type PointerEvent, useId } from "react";

import { Icon } from "@/components/Icons/Icon";
import { Pill } from "@/components/Pill";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import {
  Align,
  BackgroundColor,
  bgColorClass,
  ElementState,
  IconName,
  Justify,
  Orientation,
  Size,
  Spacing,
  TextColor,
  TextVariant,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";
import { useDisclosure } from "@/util/useDisclosure";

import type { ResolvedNode } from "./types";

const DEPTH_INDENT = "var(--spacing-md)";

interface TreeSelectNodeProps {
  resolved: ResolvedNode;
  selectedPath?: string;
}

/**
 * Renders a single node row and, when expanded, recursively renders its
 * children. Handles three distinct cases:
 *
 * 1. **Selectable leaf** — rendered as a `ComboboxOption`.
 * 2. **Selectable branch** — rendered as a `ComboboxOption` with an
 *    embedded chevron button whose click `stopPropagation`s to toggle
 *    expansion without triggering selection.
 * 3. **Non-selectable branch** (`can_select: false`) — rendered as a
 *    plain row (not a `ComboboxOption`) that toggles expansion on any
 *    click. Children are still real `ComboboxOption`s.
 *
 * @internal For use by TreeSelect.
 */
export const TreeSelectNode: FC<TreeSelectNodeProps> = ({
  resolved,
  selectedPath,
}) => {
  const { node, path, depth, selectable, isLeaf, children } = resolved;
  const isBranch = !isLeaf;
  const isSelected = path === selectedPath;

  const { open, toggle } = useDisclosure({
    defaultOpen: depth <= 1,
  });

  const groupId = useId() + "-group";
  const textColor = node.deprecated ? TextColor.Muted : TextColor.Primary;

  const stopAndToggle = (e: MouseEvent | PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggle();
  };

  const indentStyle = {
    paddingLeft: `calc(${depth} * ${DEPTH_INDENT} + var(--spacing-sm) + var(--spacing-xs))`,
  };

  const rowClasses = cn(
    "flex-nowrap",
    "py-2 px-3",
    bgColorClass(BackgroundColor.Card1),
    isSelected && bgColorClass(BackgroundColor.CardElevated),
    bgColorClass(BackgroundColor.Card2, ElementState.Hover),
    "cursor-pointer"
  );

  const chevron = isBranch ? (
    <button
      type="button"
      tabIndex={-1}
      aria-expanded={open}
      aria-controls={groupId}
      aria-label={open ? `Collapse ${node.name}` : `Expand ${node.name}`}
      onClick={stopAndToggle}
      onPointerDown={stopAndToggle}
      onPointerUp={stopAndToggle}
      className="shrink-0 flex items-center justify-center size-5"
    >
      <Icon
        name={open ? IconName.ChevronBottom : IconName.ChevronRight}
        size={Size.Sm}
        color={TextColor.Secondary}
      />
    </button>
  ) : (
    <span className="size-5 shrink-0" />
  );

  const labelContent = (
    <>
      <Stack orientation={Orientation.Column} className="min-w-0 flex-1">
        <Stack align={Align.Center} spacing={Spacing.Xs}>
          {chevron}
          <Text
            variant={TextVariant.Sm}
            color={textColor}
            className="truncate"
          >
            {node.name}
          </Text>
          {node.deprecated && (
            <Pill size={Size.Xs} color={TextColor.Muted}>
              deprecated
            </Pill>
          )}
        </Stack>
        {node.description && (
          <Text
            variant={TextVariant.Xs}
            color={TextColor.Tertiary}
            className="truncate"
            style={{
              paddingLeft: `calc(var(--spacing-md) + var(--spacing-xs))`,
            }}
          >
            {node.description}
          </Text>
        )}
      </Stack>

      <span
        className={cn(
          "size-5 shrink-0 flex items-center",
          textColorClass(TextColor.Secondary)
        )}
      >
        {isSelected && <Icon name={IconName.Check} size={Size.Sm} />}
      </span>
    </>
  );

  const row = selectable ? (
    <ComboboxOption value={path}>
      <Stack
        align={Align.Center}
        justify={Justify.Between}
        spacing={Spacing.Md}
        className={rowClasses}
        style={indentStyle}
      >
        {labelContent}
      </Stack>
    </ComboboxOption>
  ) : (
    <Stack
      align={Align.Center}
      justify={Justify.Between}
      spacing={Spacing.Md}
      className={rowClasses}
      style={indentStyle}
      onClick={isBranch ? toggle : undefined}
    >
      {labelContent}
    </Stack>
  );

  return (
    <>
      {row}
      {isBranch && open && (
        <div role="group" id={groupId}>
          {children.map((child) => (
            <TreeSelectNode
              key={child.path}
              resolved={child}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </>
  );
};

TreeSelectNode.displayName = "TreeSelectNode";
