// Copyright 2017-2026, Voxel51, Inc.

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  type FC,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { Dropdown, DropdownAnchor } from "@/components/Dropdown";
import { IconAction } from "@/components/IconAction";
import { MoreHorizontalIcon } from "@/components/Icons";
import { cn } from "@/util/classes";
import {
  MENU_FIT,
  OverflowRowCompactContext,
  type OverflowRowFit,
  useOverflowRowCompact,
  useOverflowRowFit,
} from "@/util/compact";
import { useOverflowFit } from "@/util/useOverflowFit";

/** Space between items, in pixels: Tailwind's `gap-1`. */
const GAP = 4;

/** Width of the overflow button at each size, in pixels. */
const MORE_WIDTH = { sm: 26, md: 36 } as const;

export interface OverflowRowProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** The items, in priority order: the last ones move into the menu first. */
  children: ReactNode;
  /** Accessible label of the overflow button. Default `"More"`. */
  label?: string;
  /**
   * Lets the items shrink before any move into the menu: their labels are cut,
   * widest first, then they drop to icon-only (`collapse="auto"` actions do
   * both; see {@link useOverflowRowFit}). Default `false`.
   */
  compactable?: boolean;
  /** Size of the overflow button: `"md"` (default) or `"sm"`, beside small actions. */
  size?: "sm" | "md";
  /**
   * Takes only the width its items need, shrinking (and folding items into the
   * menu) when the parent is narrower, instead of filling the parent. Default `false`.
   */
  hug?: boolean;
  /**
   * Called when the row shortens or restores its items: whether they are cut,
   * compact or partly in the menu, so neighbours can shrink alongside.
   */
  onFitChange?: (fit: OverflowRowFit & { folded: boolean }) => void;
}

export { OverflowRowCompactContext, useOverflowRowCompact, useOverflowRowFit };
export type { OverflowRowFit };

const keyOf = (child: ReactNode, index: number): string =>
  isValidElement(child) && child.key !== null ? String(child.key) : `#${index}`;

/**
 * A row of items that fills the space it is given, with the items that no
 * longer fit moved into a "more" menu.
 *
 * It takes the width of its container (`flex: 1`, `min-width: 0`), never wraps
 * and never overlaps: the last items leave the row first and render in the
 * menu instead. Every item is rendered once in the row first, to be measured.
 *
 * @param children The items, in priority order: the last ones move into the menu first.
 * @param label Accessible label of the overflow button. Default `"More"`.
 * @param onFitChange Called when the row shortens or restores its items, so neighbours can shrink alongside.
 * @param size Size of the overflow button: `"md"` (default) or `"sm"`, beside small actions. Items in its menu render in full: an {@link IconAction} becomes a labelled menu row.
 * @param hug Takes only the width its items need, shrinking and folding when the parent is narrower, instead of filling it. Default `false`.
 * @param compactable Lets the items shrink before any move into the menu: labels cut widest first, then icon-only (see {@link useOverflowRowFit}). Default `false`.
 * @param className `class` overrides for the root.
 * @param props Additional HTML properties for the root.
 *
 * @example
 * ```tsx
 * <OverflowRow label="More actions">
 *   <TextAction onClick={group}>Group</TextAction>
 *   <TextAction onClick={patches}>Patches</TextAction>
 *   <TextAction onClick={plugins}>Plugins</TextAction>
 * </OverflowRow>
 * ```
 */
export const OverflowRow: FC<OverflowRowProps> = ({
  children,
  label = "More",
  compactable = false,
  size = "md",
  hug = false,
  onFitChange,
  className,
  style,
  ...props
}) => {
  const items = Children.toArray(children);
  const keys = items.map(keyOf);
  const {
    ref,
    itemRef,
    fit: shown,
    context,
    natural,
  } = useOverflowFit(keys, {
    gap: GAP,
    reserve: MORE_WIDTH[size],
    compactable,
  });
  const folded = shown < items.length;
  const report = useRef(onFitChange);
  report.current = onFitChange;
  useEffect(() => {
    report.current?.({ ...context, folded });
  }, [context, folded]);

  return (
    <div
      ref={ref}
      className={cn(
        // never narrower than its menu button, so every item stays reachable
        "flex min-w-9 flex-1 items-center gap-1 overflow-hidden",
        className
      )}
      style={hug && natural ? { flex: `0 1 ${natural}px`, ...style } : style}
      {...props}
    >
      <OverflowRowCompactContext.Provider value={context}>
        {items.slice(0, shown).map((item, index) => (
          <div
            key={keys[index]}
            ref={itemRef(keys[index])}
            className="shrink-0"
          >
            {item}
          </div>
        ))}
      </OverflowRowCompactContext.Provider>
      {shown < items.length && (
        <Dropdown
          anchor={DropdownAnchor.BottomEnd}
          trigger={
            <IconAction
              icon={MoreHorizontalIcon}
              size={size}
              aria-label={label}
            />
          }
        >
          <OverflowRowCompactContext.Provider value={MENU_FIT}>
            {items.slice(shown).map((item, index) => (
              <div key={keys[shown + index]} className="px-1 py-0.5">
                {item}
              </div>
            ))}
          </OverflowRowCompactContext.Provider>
        </Dropdown>
      )}
    </div>
  );
};
