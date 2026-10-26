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
});
