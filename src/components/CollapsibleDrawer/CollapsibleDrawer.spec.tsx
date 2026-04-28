import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CollapsibleDrawer from "./CollapsibleDrawer";

describe("CollapsibleDrawer", () => {
  it("should render with a label", () => {
    render(<CollapsibleDrawer label="Settings" />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("should render without a label", () => {
    render(<CollapsibleDrawer />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render children", () => {
    render(
      <CollapsibleDrawer>
        <span>drawer content</span>
      </CollapsibleDrawer>
    );
    expect(screen.getByText("drawer content")).toBeInTheDocument();
  });

  it("should be open by default", () => {
    render(<CollapsibleDrawer label="Settings" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("should be closed when defaultOpen is false", () => {
    render(<CollapsibleDrawer label="Settings" defaultOpen={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("should close when clicked while open", async () => {
    const user = userEvent.setup();
    render(<CollapsibleDrawer label="Settings" defaultOpen={true} />);
    const toggle = screen.getByRole("button");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("should open when clicked while closed", async () => {
    const user = userEvent.setup();
    render(<CollapsibleDrawer label="Settings" defaultOpen={false} />);
    const toggle = screen.getByRole("button");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("should toggle back to original state on double click", async () => {
    const user = userEvent.setup();
    render(<CollapsibleDrawer label="Settings" defaultOpen={true} />);
    const toggle = screen.getByRole("button");

    await user.click(toggle);
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("should apply drawerOpen class when open", () => {
    const { container } = render(<CollapsibleDrawer defaultOpen={true} />);
    expect(container.querySelector(".drawer")).toHaveClass("drawerOpen");
  });

  it("should not apply drawerOpen class when closed", () => {
    const { container } = render(<CollapsibleDrawer defaultOpen={false} />);
    expect(container.querySelector(".drawer")).not.toHaveClass("drawerOpen");
  });

  it("should apply className prop to the root element", () => {
    const { container } = render(<CollapsibleDrawer className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should apply style prop to the root element", () => {
    const { container } = render(<CollapsibleDrawer style={{ width: 200 }} />);
    expect(container.firstChild).toHaveStyle({ width: "200px" });
  });

  describe("align", () => {
    it("should not apply toggleRight class when align is left", () => {
      const { container } = render(
        <CollapsibleDrawer label="Settings" align="left" />
      );
      expect(container.querySelector(".toggle")).not.toHaveClass("toggleRight");
    });

    it("should apply toggleRight class when align is right", () => {
      const { container } = render(
        <CollapsibleDrawer label="Settings" align="right" />
      );
      expect(container.querySelector(".toggle")).toHaveClass("toggleRight");
    });

    it("should default to left align", () => {
      const { container } = render(<CollapsibleDrawer label="Settings" />);
      expect(container.querySelector(".toggle")).not.toHaveClass("toggleRight");
    });
  });

  describe("controlled mode", () => {
    it("should reflect the open prop when true", () => {
      render(<CollapsibleDrawer label="Settings" open={true} />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });

    it("should reflect the open prop when false", () => {
      render(<CollapsibleDrawer label="Settings" open={false} />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    });

    it("should not change state on click when controlled", async () => {
      const user = userEvent.setup();
      render(<CollapsibleDrawer label="Settings" open={true} />);
      const toggle = screen.getByRole("button");

      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "true");
    });

    it("should call onOpenChange with false when open and clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      render(
        <CollapsibleDrawer label="Settings" open={true} onOpenChange={onOpenChange} />
      );

      await user.click(screen.getByRole("button"));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("should call onOpenChange with true when closed and clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      render(
        <CollapsibleDrawer label="Settings" open={false} onOpenChange={onOpenChange} />
      );

      await user.click(screen.getByRole("button"));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("should call onOpenChange in uncontrolled mode too", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      render(
        <CollapsibleDrawer label="Settings" defaultOpen={true} onOpenChange={onOpenChange} />
      );

      await user.click(screen.getByRole("button"));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
