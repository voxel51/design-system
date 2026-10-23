// Copyright 2017-2026, Voxel51, Inc.

import {
  Children,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type FC,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { Dropdown, DropdownAnchor } from "@/components/Dropdown";
import { IconAction } from "@/components/IconAction";
import { MoreHorizontalIcon } from "@/components/Icons";
import { cn } from "@/util/classes";
import { useElementSize } from "@/util/useElementSize";

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
}

const keyOf = (child: ReactNode, index: number): string =>
  isValidElement(child) && child.key !== null ? String(child.key) : `#${index}`;

/**
 * A row of items that fills the space it is given, with the items that no
 * longer fit moved into a "more" menu.
 *
 * It takes the width of its container (`flex: 1`, `min-width: 0`), never wraps
 * and never overlaps: the last items leave the row first and render in the
 * menu instead, so each item is mounted once.
 *
 * @param children The items, in priority order: the last ones move into the menu first.
 * @param label Accessible label of the overflow button. Default `"More"`.
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
  className,
  ...props
}) => {
  const items = Children.toArray(children);
  const keys = items.map(keyOf);
  const signature = keys.join("|");
  const { ref, width } = useElementSize();
  const slots = useRef(new Map<string, HTMLElement>());
  const widths = useRef(new Map<string, number>());
  const [fit, setFit] = useState(items.length);

  useLayoutEffect(() => {
    slots.current.forEach((el, key) => widths.current.set(key, el.offsetWidth));
    widths.current.forEach((_, key) => {
      if (!keys.includes(key)) widths.current.delete(key);
    });
    if (!width) return;

    // An item never rendered in the row has no width yet: render them all once
    if (keys.some((key) => !widths.current.has(key))) {
      setFit(items.length);
      return;
    }

    const total = keys.reduce(
      (sum, key) => sum + (widths.current.get(key) ?? 0) + GAP,
      -GAP
    );
    let next = items.length;
    if (total > width) {
      const room = width - MORE_WIDTH - GAP;
      let used = 0;
      next = 0;
      while (
        next < items.length &&
        used + (widths.current.get(keys[next]) ?? 0) <= room
      ) {
        used += (widths.current.get(keys[next]) ?? 0) + GAP;
        next += 1;
      }
    }
    setFit(next);
    // `keys` and `items` follow `signature`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, width, fit]);

  const shown = Math.min(fit, items.length);

  return (
    <div
      ref={ref}
      className={cn(
        "flex min-w-0 flex-1 items-center gap-1 overflow-hidden",
        className
      )}
      {...props}
    >
      {items.slice(0, shown).map((item, index) => (
        <div
          key={keys[index]}
          ref={(el) => {
            if (el) slots.current.set(keys[index], el);
            else slots.current.delete(keys[index]);
          }}
          className="shrink-0"
        >
          {item}
        </div>
      ))}
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
