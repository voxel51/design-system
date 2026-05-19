import type { FC } from "react";

import { Checkbox } from "@/components/Checkbox";
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
import type { UseTreeReturn } from "@/util/useTree";

import type { ResolvedNode } from "./types";

const DEPTH_INDENT = "var(--spacing-md)";

export interface TreeSelectNodeProps {
  resolved: ResolvedNode;
  tree: UseTreeReturn;
  query?: string;
  multiple?: boolean;
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
 * children. All state is driven by the `tree` hook — this component is
 * simply presentation.
 *
 * @internal For use by TreeSelect.
 */
export const TreeSelectNode: FC<TreeSelectNodeProps> = ({ resolved, tree, query, multiple }) => {
  const { node, path, depth, children } = resolved;
  const isBranch = !resolved.isLeaf;
  const isSelected = tree.isSelected(resolved);
  const isActive = tree.isActive(path);
  const effectiveOpen = tree.isOpen(path);

  const showIndeterminate =
    !!multiple && isBranch && !isSelected && tree.hasSelectedDescendant(resolved);

  const itemProps = tree.getItemProps(resolved);
  const textColor = node.deprecated ? TextColor.Muted : TextColor.Primary;

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
    bgColorClass(BackgroundColor.Card2, ElementState.Hover),
    bgColorClass(BackgroundColor.Card2, ElementState.Active)
  );

  const chevron = isBranch ? (
    <button
      type="button"
      tabIndex={-1}
      {...tree.getChevronProps(resolved)}
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
          {multiple && (resolved.selectable || showIndeterminate) && (
            <Checkbox
              checked={isSelected}
              indeterminate={showIndeterminate}
              size={Size.Sm}
              radius={Radius.Xs}
              className="pointer-events-none"
            />
          )}
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

      {!multiple && (
        <span
          className={cn(
            "size-5 shrink-0 flex items-center",
            textColorClass(TextColor.Secondary)
          )}
        >
          {isSelected && <Icon name={IconName.Check} size={Size.Sm} />}
        </span>
      )}
    </>
  );

  return (
    <>
      <div {...itemProps}>
        <Stack
          align={Align.Center}
          justify={Justify.Between}
          spacing={Spacing.Md}
          className={rowClasses}
          style={indentStyle}
          data-active={isActive || undefined}
        >
          {labelContent}
        </Stack>
      </div>
      {isBranch && effectiveOpen && (
        <div {...tree.getGroupProps(resolved)}>
          {children.map((child) => (
            <TreeSelectNode
              key={child.path}
              resolved={child}
              tree={tree}
              query={query}
              multiple={multiple}
            />
          ))}
        </div>
      )}
    </>
  );
};

TreeSelectNode.displayName = "TreeSelectNode";
