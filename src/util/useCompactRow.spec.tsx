import { act, render, screen } from "@testing-library/react";

import { useCompactRow } from "./useCompactRow";

function Row({ width, parts }: { width: number; parts: number[] }) {
  const { ref, compact } = useCompactRow();
  return (
    <div ref={ref} data-width={width} style={{ display: "flex" }}>
      {parts.map((w, i) => (
        <span key={i} data-part={w} />
      ))}
      <output>{String(compact)}</output>
    </div>
  );
}

describe("useCompactRow", () => {
  beforeEach(() => {
    globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
    jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockImplementation(function (this: HTMLElement) {
        return Number(this.dataset.width ?? 0);
      });
    jest
      .spyOn(HTMLElement.prototype, "scrollWidth", "get")
      .mockImplementation(function (this: HTMLElement) {
        return Number(this.dataset.part ?? 0);
      });
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        return { width: Number(this.dataset.part ?? 1) } as DOMRect;
      });
  });

  afterEach(() => jest.restoreAllMocks());

  const measure = (): void => {
    const calls = (
      globalThis.ResizeObserver as unknown as jest.Mock<unknown, [() => void]>
    ).mock.calls;
    act(() => calls[calls.length - 1][0]());
  };

  it("stays full while the parts fit", () => {
    render(<Row width={300} parts={[100, 100]} />);
    measure();
    expect(screen.getByRole("status")).toHaveTextContent("false");
  });

  it("goes compact when the parts overflow the row", () => {
    render(<Row width={150} parts={[100, 100]} />);
    measure();
    expect(screen.getByRole("status")).toHaveTextContent("true");
  });
});
