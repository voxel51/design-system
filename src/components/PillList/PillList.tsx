import type { FC } from "react";

import { Pill, type PillProps } from "@/components/Pill";
import { TextAction } from "@/components/TextAction";
import { useShowMore } from "@/util/useShowMore";

export interface PillListProps extends Pick<
  PillProps,
  "size" | "backgroundColor"
> {
  /** The pills' text. */
  items: string[];
  /** How many show before "+N more". Defaults to 12. */
  max?: number;
  /** Keeps every pill showing, such as while a search matches a hidden one. */
  expanded?: boolean;
}

/**
 * A wrapping row of pills that shows the first few, with the rest behind
 * "+N more" and "Show less".
 *
 * @example
 * ```tsx
 * <PillList items={models} max={8} />
 * ```
 *
 * @param items The pills' text.
 * @param max How many show before "+N more". Defaults to 12.
 * @param expanded Keeps every pill showing; the toggle hides meanwhile.
 * @param size The pills' size. Defaults to `"sm"`.
 * @param backgroundColor The pills' background; see {@link PillProps}.
 */
export const PillList: FC<PillListProps> = ({
  items,
  max = 12,
  expanded: forced,
  size = "sm",
  backgroundColor,
}) => {
  const { shown, hidden, open, toggle } = useShowMore(items, max, forced);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {shown.map((item, i) => (
        <Pill key={i} size={size} backgroundColor={backgroundColor}>
          {item}
        </Pill>
      ))}
      {hidden > 0 && (
        <TextAction size="sm" aria-expanded={open} onClick={toggle}>
          {open ? "Show less" : `+${hidden} more`}
        </TextAction>
      )}
    </div>
  );
};
