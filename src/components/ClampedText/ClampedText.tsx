import {
  type CSSProperties,
  type FC,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { CopyAction } from "@/components/CopyAction";
import { Text } from "@/components/Text";
import { TextAction } from "@/components/TextAction";
import { TextColor, TextVariant } from "@/types";
import { cn } from "@/util/classes";

/** The most characters drawn; copy still takes all of the text. */
const MAX_CHARS = 20_000;

/** How many lines of text sit in `el`, counted from where its text is drawn. */
const countLines = (el: HTMLElement): number => {
  const tops = new Set<number>();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of Array.from(range.getClientRects?.() ?? [])) {
      if (rect.height > 0) tops.add(Math.round(rect.top));
    }
  }
  return tops.size;
};

export interface ClampedTextProps {
  /** The text; line breaks are kept. */
  children: string;
  /** How many lines show before "Show more". Defaults to 6. */
  lines?: number;
  /** Keeps the text open, such as while a search matches it. */
  expanded?: boolean;
  className?: string;
}

/**
 * Text that shows its first lines. Once it runs past them it gets "Show more"
 * and a copy action; text that fits gets neither. The lines are counted from
 * where the text is drawn, so it holds for any text and any width.
 *
 * @example
 * ```tsx
 * <ClampedText lines={4}>{traceback}</ClampedText>
 * ```
 *
 * @param children The text.
 * @param lines How many lines show before "Show more". Defaults to 6.
 * @param expanded Keeps the text open, such as while a search matches it; "Show more" hides meanwhile.
 * @param className `class` overrides for the text.
 */
export const ClampedText: FC<ClampedTextProps> = ({
  children: text,
  lines = 6,
  expanded: forced,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [toggled, setToggled] = useState(false);
  const shown = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;
  const open = toggled || !!forced;
  const overflowing = count > lines;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = (): void => {
      const { cssText } = el.style;
      el.style.cssText = "white-space: pre-wrap; overflow-wrap: anywhere";
      setCount(countLines(el));
      el.style.cssText = cssText;
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    let width = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === width) return;
      width = el.clientWidth;
      measure();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  const clamp: CSSProperties | undefined =
    overflowing && !open
      ? {
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: lines,
          overflow: "hidden",
        }
      : undefined;

  return (
    <div className="flex flex-col gap-1">
      <div
        ref={ref}
        className={cn("whitespace-pre-wrap break-words", className)}
        style={clamp}
      >
        <Text variant={TextVariant.BodySecondary} color={TextColor.Primary}>
          {shown}
          {open && text.length > MAX_CHARS && "…"}
        </Text>
      </div>
      {(overflowing || text.length > MAX_CHARS) && (
        <div className="flex items-center gap-1">
          {!forced && (
            <TextAction
              size="sm"
              aria-expanded={open}
              onClick={() => setToggled(!open)}
            >
              {open ? "Show less" : "Show more"}
            </TextAction>
          )}
          <CopyAction text={text} />
        </div>
      )}
    </div>
  );
};
