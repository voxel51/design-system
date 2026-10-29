import { render, screen } from "@testing-library/react";
import { useState } from "react";

import { useClippedItems } from "./useClippedItems";

function Row() {
  const [row, setRow] = useState<HTMLElement | null>(null);
  const clipped = useClippedItems(row);
  return (
    <>
      <div ref={setRow} data-box="0,100">
        <span data-clip-key="a" data-box="0,50" />
        <span data-clip-key="b" data-box="50,100" />
        <span data-clip-key="c" data-box="100,150" />
      </div>
      <output>{clipped.join()}</output>
    </>
  );
}

describe("useClippedItems", () => {
  beforeEach(() => {
    globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const [left, right] = (this.dataset.box ?? "0,0")
          .split(",")
          .map(Number);
        return { left, right } as DOMRect;
      });
  });

  afterEach(() => jest.restoreAllMocks());

  it("lists the items outside the row's visible part", () => {
    render(<Row />);
    expect(screen.getByRole("status")).toHaveTextContent("c");
  });
});
