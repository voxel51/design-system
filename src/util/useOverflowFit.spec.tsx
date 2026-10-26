import { render, screen } from "@testing-library/react";

import { useOverflowFit } from "./useOverflowFit";

const ITEM = 40;

function Row({ width, reserve }: { width: number; reserve?: number }) {
  const keys = ["a", "b", "c"];
  const { ref, itemRef, fit } = useOverflowFit(keys, { gap: 4, reserve });
  return (
    <div ref={ref} data-width={width}>
      {keys.slice(0, fit).map((key) => (
        <span key={key} ref={itemRef(key)} data-item="">
          {key}
        </span>
      ))}
      <output>{fit}</output>
    </div>
  );
}

describe("useOverflowFit", () => {
  let offsetWidth: PropertyDescriptor | undefined;

  beforeEach(() => {
    globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
    offsetWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetWidth"
    );
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get(this: HTMLElement) {
        if (this.dataset.item !== undefined) return ITEM;
        return Number(this.dataset.width ?? 0);
      },
    });
  });

  afterEach(() => {
    if (offsetWidth)
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", offsetWidth);
  });

  it("keeps every item when they all fit", () => {
    render(<Row width={200} />);
    expect(screen.getByRole("status")).toHaveTextContent("3");
  });

  it("keeps the first items that fit, leaving room for the overflow control", () => {
    render(<Row width={100} />);
    expect(screen.getByRole("status")).toHaveTextContent("1");
  });

  it("uses the whole width when the overflow control sits elsewhere", () => {
    render(<Row width={100} reserve={0} />);
    expect(screen.getByRole("status")).toHaveTextContent("2");
  });

  describe("compactable", () => {
    // each item: 30px of icon and padding plus its label
    const LABELS: Record<string, number> = { a: 100, b: 60, c: 40 };

    function Labelled({ width }: { width: number }) {
      const keys = Object.keys(LABELS);
      const fit = useOverflowFit(keys, { gap: 0, compactable: true });
      return (
        <div ref={fit.ref} data-width={width}>
          {keys.slice(0, fit.fit).map((key) => (
            <span key={key} ref={fit.itemRef(key)} data-key={key}>
              <span data-collapse-label="" data-label={LABELS[key]} />
            </span>
          ))}
          <output>{fit.compact ? "compact" : String(fit.labelMax)}</output>
        </div>
      );
    }

    beforeEach(() => {
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get(this: HTMLElement) {
          if (this.dataset.key) return 30 + LABELS[this.dataset.key];
          return Number(this.dataset.width ?? 0);
        },
      });
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get(this: HTMLElement) {
          return Number(this.dataset.label ?? 0);
        },
      });
    });

    it("cuts the widest label first while that is enough", () => {
      // full: 3 * 30 + 200 = 290; 270 wide is 20 short
      render(<Labelled width={270} />);
      expect(screen.getByRole("status")).toHaveTextContent("80");
    });

    it("goes compact once labels would fall below the minimum", () => {
      render(<Labelled width={120} />);
      expect(screen.getByRole("status")).toHaveTextContent("compact");
    });
  });
});
