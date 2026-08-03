import { render, screen } from "@testing-library/react";

import { Orientation } from "@/types";

import { Divider, DividerStyle } from "./Divider";

describe("Divider", () => {
  it("should render horizontal Divider without label by default", () => {
    const { container } = render(<Divider />);
    expect(screen.getByTestId("divider-line-before")).toHaveClass("h-px");
    expect(container.textContent).toBe("");
  });

  it("should render vertical Divider when orientation is provided", () => {
    const { container } = render(<Divider orientation={Orientation.Column} />);
    expect(screen.getByTestId("divider-line-before")).toHaveClass("w-px");
    expect(container.textContent).toBe("");
  });

  it("should render Divider with label", () => {
    const LABEL = "Label";
    render(<Divider label={LABEL} />);
    expect(screen.queryByText(LABEL)).toBeInTheDocument();
    expect(screen.getByTestId("divider-line-before")).toHaveClass("h-px");
    expect(screen.getByTestId("divider-line-after")).toHaveClass("h-px");
  });

  describe("vertical divider with a label", () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
      warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it("drops the label and warns", () => {
      const LABEL = "Label";
      render(<Divider label={LABEL} orientation={Orientation.Column} />);

      expect(screen.queryByText(LABEL)).not.toBeInTheDocument();
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringMatching(/orientation=Orientation.Column/)
      );
    });

    it("does not warn for a horizontal divider with a label", () => {
      render(<Divider label="Label" />);

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe("dot style", () => {
    it("renders a single centered dot when no label is provided", () => {
      render(<Divider dividerStyle={DividerStyle.Dot} />);

      expect(screen.getByTestId("divider-dot")).toBeInTheDocument();
      expect(screen.getByTestId("divider-line-before")).toBeInTheDocument();
      expect(screen.getByTestId("divider-line-after")).toBeInTheDocument();
    });

    it("renders the label with dotted lines instead of a single dot when a label is present", () => {
      const LABEL = "Label";
      render(<Divider dividerStyle={DividerStyle.Dot} label={LABEL} />);

      expect(screen.queryByTestId("divider-dot")).not.toBeInTheDocument();
      expect(screen.getByText(LABEL)).toBeInTheDocument();
    });

    it("does not render a dot for the default line style", () => {
      render(<Divider />);

      expect(screen.queryByTestId("divider-dot")).not.toBeInTheDocument();
    });
  });
});
