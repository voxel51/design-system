import { render, screen } from "@testing-library/react";

import { ProgressBar, ProgressSize, ProgressVariant } from "./ProgressBar";

describe("ProgressBar", () => {
  it("should render with a determinate value", () => {
    render(<ProgressBar value={50} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "50");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("should render in indeterminate mode when value is omitted", () => {
    render(<ProgressBar />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("should clamp value below 0 to 0", () => {
    render(<ProgressBar value={-10} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("should clamp value above 100 to 100", () => {
    render(<ProgressBar value={150} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });

  it("should render a label", () => {
    render(<ProgressBar value={40} label="Uploading" />);
    expect(screen.getByText("Uploading")).toBeInTheDocument();
  });

  it("should show percentage when showValue is true", () => {
    render(<ProgressBar value={75} showValue />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("should not show percentage when showValue is false", () => {
    render(<ProgressBar value={75} showValue={false} />);
    expect(screen.queryByText("75%")).not.toBeInTheDocument();
  });

  it("should not show percentage in indeterminate mode even when showValue is true", () => {
    render(<ProgressBar showValue />);
    expect(screen.queryByText("%")).not.toBeInTheDocument();
  });

  it("should set aria-label from the label prop", () => {
    render(<ProgressBar value={30} label="Processing" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "Processing"
    );
  });

  it("should pass through className to the root element", () => {
    render(<ProgressBar value={50} className="custom-class" />);
    // the root div wraps the progressbar track
    const root = screen.getByRole("progressbar").parentElement;
    expect(root).toHaveClass("custom-class");
  });

  it("should render for every ProgressVariant without throwing", () => {
    Object.values(ProgressVariant).forEach((variant) => {
      expect(() =>
        render(<ProgressBar value={50} variant={variant} />)
      ).not.toThrow();
    });
  });

  it("should render for every ProgressSize without throwing", () => {
    Object.values(ProgressSize).forEach((size) => {
      expect(() =>
        render(<ProgressBar value={50} size={size} />)
      ).not.toThrow();
    });
  });
});
