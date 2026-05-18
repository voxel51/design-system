import { ComboboxOption } from "@headlessui/react";
import { type FC, type MouseEvent, type PointerEvent, useId } from "react";

import { Icon } from "@/components/Icons/Icon";
import { Pill } from "@/components/Pill";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  Align,
  BackgroundColor,
  BrandColor,
  bgColorClass,
  ElementState,
  IconName,
  Justify,
  Orientation,
  Radius,
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
  forceOpenPaths?: Set<string>;
  query?: string;
}

function highlightMatch(text: string, query?: string): React.ReactNode {
  if (!query) return text;

  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <>
      {before}
      <span className={textColorClass(BrandColor.Primary)}>{match}</span>
      {after}
    </>
  );
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
  forceOpenPaths,
  query,
}) => {
  const { node, path, depth, selectable, isLeaf, children } = resolved;
  const isBranch = !isLeaf;
  const isSelected = path === selectedPath;
  const isForceOpen = forceOpenPaths?.has(path) ?? false;

  const { open, toggle } = useDisclosure({
    defaultOpen: false,
  });

  const effectiveOpen = isForceOpen || open;

  const groupId = useId() + "-group";
  const textColor = node.deprecated ? TextColor.Muted : TextColor.Primary;

  const stopEvent = (e: MouseEvent | PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleChevronClick = (e: MouseEvent) => {
    stopEvent(e);
    toggle();
  };

  const indentStyle = {
    paddingLeft: `calc(${depth - 1} * ${DEPTH_INDENT} + var(--spacing-xs))`,
  };

  const rowClasses = cn(
    "flex-nowrap",
    "py-1.5",
    radiusStyles(Radius.Sm),
    "cursor-pointer",
    bgColorClass(BackgroundColor.Card1),
    isSelected && bgColorClass(BackgroundColor.CardElevated),
    bgColorClass(BackgroundColor.Card2, ElementState.Hover)
  );

  const chevron = isBranch ? (
    <button
      type="button"
      tabIndex={-1}
      aria-expanded={effectiveOpen}
      aria-controls={groupId}
      aria-label={
        effectiveOpen ? `Collapse ${node.name}` : `Expand ${node.name}`
      }
      onClick={handleChevronClick}
      onPointerDown={stopEvent}
      onPointerUp={stopEvent}
      className={cn(
        "group",
        "cursor-pointer",
        "shrink-0 flex items-center justify-center size-5 rounded-full",
        bgColorClass(BackgroundColor.CardElevated, ElementState.Hover)
      )}
    >
      <Icon
        name={IconName.ChevronRight}
        size={Size.Sm}
        className={cn(
          "text-content-text-secondary",
          "group-hover:text-content-text-primary",
          effectiveOpen && "rotate-90"
        )}
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
          <Text variant={TextVariant.Sm} color={textColor} className="truncate">
            {highlightMatch(node.name, query)}
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
      {isBranch && effectiveOpen && (
        <div role="group" id={groupId}>
          {children.map((child) => (
            <TreeSelectNode
              key={child.path}
              resolved={child}
              selectedPath={selectedPath}
              forceOpenPaths={forceOpenPaths}
              query={query}
            />
          ))}
        </div>
      )}
    </>
  );
};

TreeSelectNode.displayName = "TreeSelectNode";
