import { render } from "@testing-library/react";
import { useRef } from "react";

import { useTextHighlight } from "./useTextHighlight";

const Highlighted = ({ text, query }: { text: string; query: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useTextHighlight(ref, query);
  return <div ref={ref}>{text}</div>;
};

describe("useTextHighlight", () => {
  const registry = new Map<string, unknown>();

  beforeAll(() => {
    (globalThis as unknown as { CSS: unknown }).CSS = {
      highlights: registry,
    };
    (globalThis as unknown as { Highlight: unknown }).Highlight = class {
      constructor(...ranges: Range[]) {
        Object.assign(this, { ranges });
      }
    };
  });

  it("keeps a highlight per instance", () => {
    const { unmount } = render(
      <>
        <Highlighted text="alpha" query="alp" />
        <Highlighted text="beta" query="bet" />
      </>
    );
    expect(registry.size).toBe(2);
    unmount();
    expect(registry.size).toBe(0);
  });

  it("gives matches their own text colour", () => {
    render(<Highlighted text="alpha" query="alp" />);
    expect(document.head.querySelector("style")?.textContent).toContain(
      "color: var(--color-content-text-primary)"
    );
  });
});
