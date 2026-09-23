import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Sheet, SheetSide } from "./Sheet";

describe("Sheet", () => {
  it("renders nothing when closed", () => {
    render(
      <Sheet open={false} onClose={jest.fn()} title="Run">
        body
      </Sheet>
    );

    expect(screen.queryByText("body")).not.toBeInTheDocument();
  });

  it("renders the title and children when open", () => {
    render(
      <Sheet open onClose={jest.fn()} title="Run">
        body
      </Sheet>
    );

    expect(screen.getByText("Run")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("closes on the close button", async () => {
    const onClose = jest.fn();
    render(
      <Sheet open onClose={onClose} title="Run">
        body
      </Sheet>
    );

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", async () => {
    const onClose = jest.fn();
    render(
      <Sheet open onClose={onClose} title="Run">
        body
      </Sheet>
    );

    await userEvent.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });

  it("anchors to the right by default and to the left when asked", () => {
    const { unmount } = render(
      <Sheet open onClose={jest.fn()} title="Run">
        body
      </Sheet>
    );
    expect(screen.getByTestId("sheet-panel")).toHaveClass("right-0");
    unmount();

    render(
      <Sheet open onClose={jest.fn()} side={SheetSide.Left} title="Run">
        body
      </Sheet>
    );
    expect(screen.getByTestId("sheet-panel")).toHaveClass("left-0");
  });

  it("caps the panel at the given width", () => {
    render(
      <Sheet open onClose={jest.fn()} title="Run" width={640}>
        body
      </Sheet>
    );

    expect(screen.getByTestId("sheet-panel")).toHaveStyle({
      maxWidth: "640px",
    });
  });
});
