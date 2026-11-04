import { type RefObject, useEffect, useId } from "react";

interface HighlightRegistry {
  set(name: string, highlight: unknown): void;
  delete(name: string): void;
}

const registry = (): HighlightRegistry | undefined =>
  typeof CSS === "undefined"
    ? undefined
    : (CSS as unknown as { highlights?: HighlightRegistry }).highlights;

const ensureStyle = (name: string): void => {
  if (document.getElementById(name)) return;
  const style = document.createElement("style");
  style.id = name;
  style.textContent = `::highlight(${name}) { background-color: var(--color-content-bg-accent); color: inherit; }`;
  document.head.appendChild(style);
};

/**
 * Highlights every match of `query` in the text of `ref`'s subtree, using the
 * browser's CSS Custom Highlight API, so the content needs no markup or
 * re-render. Matches are case-insensitive, follow later changes to the
 * content, and cannot span elements or reach text typed into inputs. Does
 * nothing where the API is unavailable.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useTextHighlight(ref, search);
 * return <div ref={ref}>{content}</div>;
 * ```
 *
 * @param ref The element whose text is searched.
 * @param query The text to highlight; empty clears the highlight.
 * @param deps Extra values that should re-run the search, such as the data shown.
 */
export const useTextHighlight = (
  ref: RefObject<HTMLElement | null>,
  query: string,
  deps: unknown[] = []
): void => {
  const name = `voodo-text-highlight-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  useEffect(() => {
    const root = ref.current;
    const highlights = registry();
    if (!root || !highlights || typeof Highlight === "undefined")
      return undefined;
    const needle = query.trim().toLowerCase();
    if (!needle) {
      highlights.delete(name);
      return undefined;
    }
    ensureStyle(name);
    const apply = (): void => {
      const ranges: Range[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent?.toLowerCase() ?? "";
        for (
          let i = text.indexOf(needle);
          i >= 0;
          i = text.indexOf(needle, i + needle.length)
        ) {
          const range = new Range();
          range.setStart(node, i);
          range.setEnd(node, i + needle.length);
          ranges.push(range);
        }
      }
      highlights.set(name, new Highlight(...ranges));
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => {
      observer.disconnect();
      highlights.delete(name);
      document.getElementById(name)?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `deps` is the caller's list
  }, [ref, name, query, ...deps]);
};
