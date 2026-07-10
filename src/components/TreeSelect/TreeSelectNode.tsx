import React, { type FC } from "react";

import { Checkbox } from "@/components/Checkbox";
import { CheckIcon, ChevronRightIcon, RefreshIcon } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  Align,
  BackgroundColor,
  BrandColor,
  bgColorClass,
  ElementState,
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
  multiSelect?: boolean;
  onRetryLoad?: (path: string) => void;
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
 * Renders a single node row. The parent renders a flat list of all visible
 * nodes (via `tree.visibleNodes`), so this component never recurses.
 * Depth-based indentation produces the visual tree hierarchy.
 * All state is driven by the `tree` hook — this component is purely
 * presentational.
 *
 * @internal For use by TreeSelectPanel.
 */
export const TreeSelectNode: FC<TreeSelectNodeProps> = ({
  resolved,
  tree,
  query,
  multiSelect,
  onRetryLoad,
}) => {
  const { node, path, depth } = resolved;
  const isBranch = !resolved.isLeaf;
  const isSelected = tree.isSelected(resolved);
  const isActive = tree.isActive(path);
  const effectiveOpen = tree.isOpen(path);
  const nodeLoadState = tree.getLoadState(path);

  const showIndeterminate =
    !!multiSelect &&
    isBranch &&
    !isSelected &&
    tree.hasSelectedDescendant(resolved);

  const itemProps = tree.getItemProps(resolved);
  const textColor = node.deprecated ? TextColor.Muted : TextColor.Primary;

  const indentStyle = {
    paddingLeft: `calc(${depth - 1} * ${DEPTH_INDENT} + var(--spacing-xs))`,
  };

  const rowClasses = cn(
    "flex-nowrap",
    "py-1",
    radiusStyles(Radius.Sm),
    "cursor-pointer",
    bgColorClass(BackgroundColor.Card1),
    isSelected && bgColorClass(BackgroundColor.Selected),
    bgColorClass(BackgroundColor.CardElevated, ElementState.Hover),
    bgColorClass(BackgroundColor.CardElevated, ElementState.Active)
  );

  const chevronButton = (
    IconContent: FC<{ size?: Size; className?: string }>,
    extraClassName: string,
    props: ReturnType<typeof tree.getChevronProps> | null,
    onClick?: (e: React.MouseEvent) => void
  ): React.ReactElement => (
    <button
      type="button"
      tabIndex={-1}
      {...(props ?? {})}
      onClick={onClick ?? props?.onClick}
      className={cn(
        "group",
        "cursor-pointer",
        "shrink-0 flex items-center justify-center size-5 rounded-full",
        bgColorClass(BackgroundColor.CardElevated, ElementState.Hover)
      )}
    >
      <IconContent
        size={Size.Sm}
        className={cn(
          "text-content-text-secondary",
          !extraClassName && "group-hover:text-content-text-primary",
          extraClassName
        )}
      />
    </button>
  );

  let chevron: React.ReactNode;
  if (!isBranch) {
    chevron = <span className="size-5 shrink-0" />;
  } else if (nodeLoadState === "loading") {
    chevron = chevronButton(Spinner, "animate-spin", null, (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
  } else if (nodeLoadState === "error") {
    chevron = chevronButton(
      RefreshIcon,
      textColorClass(BrandColor.Primary),
      null,
      (e) => {
        e.stopPropagation();
        e.preventDefault();
        onRetryLoad?.(path);
      }
    );
  } else {
    chevron = chevronButton(
      ChevronRightIcon,
      effectiveOpen ? "rotate-90" : "",
      tree.getChevronProps(resolved)
    );
  }

  const labelContent = (
    <>
      <Stack orientation={Orientation.Column} className="min-w-0 flex-1">
        <Stack align={Align.Center} spacing={Spacing.Xs}>
          {chevron}
          {multiSelect && (resolved.selectable || showIndeterminate) && (
            <div className="pr-1">
              <Checkbox
                checked={isSelected}
                indeterminate={showIndeterminate}
                size={Size.Sm}
                radius={Radius.Xs}
                className="pointer-events-none"
              />
            </div>
          )}
          <Text
            variant={TextVariant.Sm}
            color={textColor}
            className="whitespace-nowrap"
          >
            {highlightMatch(node.name, query)}
          </Text>
        </Stack>
        {node.description && (
          <Text
            variant={TextVariant.Xs}
            color={TextColor.Tertiary}
            className="whitespace-nowrap"
            style={{
              paddingLeft: `calc(var(--spacing-md) + var(--spacing-xs) * 2)`,
            }}
          >
            {node.description}
          </Text>
        )}
      </Stack>

      {!multiSelect && (
        <span
          className={cn(
            "size-5 shrink-0 flex items-center",
            textColorClass(BrandColor.Primary)
          )}
        >
          {isSelected && <CheckIcon size={Size.Sm} />}
        </span>
      )}
    </>
  );

  return (
    <div {...itemProps} aria-level={depth}>
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
  );
};

TreeSelectNode.displayName = "TreeSelectNode";
