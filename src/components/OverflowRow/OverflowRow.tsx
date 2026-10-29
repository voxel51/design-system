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
  OverflowRowCompactContext,
  type OverflowRowFit,
  useOverflowRowCompact,
  useOverflowRowFit,
} from "@/util/compact";
import { useOverflowFit } from "@/util/useOverflowFit";

/** Space between items, in pixels: Tailwind's `gap-1`. */
const GAP = 4;

/** Room kept for the overflow button, in pixels. */
const MORE_WIDTH = 28;

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
  onFitChange,
  className,
  ...props
}) => {
  const items = Children.toArray(children);
  const keys = items.map(keyOf);
  const {
    ref,
    itemRef,
    fit: shown,
    context,
  } = useOverflowFit(keys, {
    gap: GAP,
    reserve: MORE_WIDTH,
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
          trigger={<IconAction icon={MoreHorizontalIcon} aria-label={label} />}
        >
          {items.slice(shown).map((item, index) => (
            <div key={keys[shown + index]} className="px-1 py-0.5">
              {item}
            </div>
          ))}
        </Dropdown>
      )}
    </div>
  );
};
