import { fireEvent, render, screen } from "@testing-library/react";

import { ClampedText } from "./ClampedText";

// jsdom has no layout: the text sits on `count` lines
const lines = (count: number) => {
  Range.prototype.getClientRects = () =>
    Array.from({ length: count }, (_, i) => ({
      top: i * 20,
      height: 20,
    })) as unknown as DOMRectList;
};

describe("ClampedText", () => {
  afterEach(() => {
    delete (Range.prototype as Partial<Range>).getClientRects;
  });

  it("leaves text that fits its lines as it is", () => {
    lines(2);
    render(<ClampedText>short</ClampedText>);

    expect(screen.getByText("short")).toBeInTheDocument();
    expect(screen.queryByText("Show more")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Copy")).not.toBeInTheDocument();
  });

  it("clamps text past its lines behind Show more, with a copy action", () => {
    lines(10);
    render(<ClampedText lines={4}>long</ClampedText>);

    expect(screen.getByLabelText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Show more")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    fireEvent.click(screen.getByText("Show more"));
    expect(screen.getByText("Show less")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("stays open while expanded is set", () => {
    lines(10);
    const { rerender } = render(<ClampedText expanded>long</ClampedText>);

    expect(screen.queryByText("Show less")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Copy")).toBeInTheDocument();

    rerender(<ClampedText>long</ClampedText>);
    expect(screen.getByText("Show more")).toBeInTheDocument();
  });

  it("draws a huge text in part", () => {
    lines(10);
    const text = "y".repeat(30_000);
    render(<ClampedText>{text}</ClampedText>);

    expect(screen.queryByText(text)).not.toBeInTheDocument();
    expect(screen.getByText("Show more")).toBeInTheDocument();
  });
});
