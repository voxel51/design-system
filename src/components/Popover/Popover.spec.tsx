import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DropdownTrigger } from "@/components/Dropdown";
import { ZIndex, zIndexStyles } from "@/types";

import { Popover, PopoverAnchor } from "./Popover";

const trigger = <DropdownTrigger>Open settings</DropdownTrigger>;

describe("Popover", () => {
  it("should render the trigger", () => {
    render(<Popover trigger={trigger}>{null}</Popover>);
    expect(screen.getByText("Open settings")).toBeInTheDocument();
  });

  it("should not show the panel before the trigger is clicked", () => {
    render(<Popover trigger={trigger}>Hidden content</Popover>);
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  it("should show the panel after the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<Popover trigger={trigger}>Visible content</Popover>);

    await user.click(screen.getByText("Open settings"));
    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });

  it("should stay open when content inside the panel is clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Popover trigger={trigger}>
        <button onClick={onClick}>Inner action</button>
      </Popover>
    );

    await user.click(screen.getByText("Open settings"));
    await user.click(screen.getByText("Inner action"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Inner action")).toBeInTheDocument();
  });

  it("should close on Escape while working in the panel", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={trigger}>
        <input aria-label="Matches" />
      </Popover>
    );

    await user.click(screen.getByText("Open settings"));
    await user.click(screen.getByLabelText("Matches"));
    await user.keyboard("{Escape}");
    expect(screen.queryByLabelText("Matches")).not.toBeInTheDocument();
  });

  it("should let the content close the panel via the render function", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={trigger}>
        {({ close }) => <button onClick={close}>Done</button>}
      </Popover>
    );

    await user.click(screen.getByText("Open settings"));
    await user.click(screen.getByText("Done"));
    expect(screen.queryByText("Done")).not.toBeInTheDocument();
  });

  it("should not open when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={trigger} disabled>
        Locked content
      </Popover>
    );

    await user.click(screen.getByText("Open settings"));
    expect(screen.queryByText("Locked content")).not.toBeInTheDocument();
  });

  it("should infer disabled from the trigger element", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<DropdownTrigger disabled>Open settings</DropdownTrigger>}
      >
        Locked content
      </Popover>
    );

    await user.click(screen.getByText("Open settings"));
    expect(screen.queryByText("Locked content")).not.toBeInTheDocument();
  });

  it("should stay open on a press in an overlay layer opened from the panel", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Popover trigger={trigger}>
          <button aria-controls="nested-menu">Layered content</button>
        </Popover>
        <div data-headlessui-portal="">
          <div id="nested-menu" role="menu">
            <button>Menu option</button>
          </div>
        </div>
      </>
    );

    await user.click(screen.getByText("Open settings"));
    await user.click(screen.getByText("Menu option"));
    expect(screen.getByText("Layered content")).toBeInTheDocument();
  });

  it("should close on a press in an unrelated overlay layer", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Popover trigger={trigger}>Layered content</Popover>
        <div data-headlessui-portal="">
          <button>Menu option</button>
        </div>
      </>
    );

    await user.click(screen.getByText("Open settings"));
    await user.click(screen.getByText("Menu option"));
    expect(screen.queryByText("Layered content")).not.toBeInTheDocument();
  });

  it("should be controllable from outside", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const { rerender } = render(
      <Popover trigger={trigger} open={false} onOpenChange={onOpenChange}>
        Controlled content
      </Popover>
    );
    expect(screen.queryByText("Controlled content")).not.toBeInTheDocument();

    // Controlled: the trigger is only the anchor
    await user.click(screen.getByText("Open settings"));
    expect(screen.queryByText("Controlled content")).not.toBeInTheDocument();

    rerender(
      <Popover trigger={trigger} open onOpenChange={onOpenChange}>
        Controlled content
      </Popover>
    );
    expect(screen.getByText("Controlled content")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("should render the panel in the flow when portal is off", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={trigger} portal={false} data-testid="root">
        In-flow content
      </Popover>
    );
    await user.click(screen.getByText("Open settings"));
    expect(screen.getByTestId("root")).toContainElement(
      screen.getByText("In-flow content")
    );
  });

  it("should apply an explicit zIndex to a portaled panel too", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={trigger} zIndex={ZIndex.High}>
        Lower content
      </Popover>
    );
    await user.click(screen.getByText("Open settings"));
    expect(screen.getByText("Lower content")).toHaveClass(
      zIndexStyles(ZIndex.High)
    );
  });

  it("should stay open on Escape when closeOnEscape is off", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={trigger} closeOnEscape={false}>
        <input aria-label="Draft" />
      </Popover>
    );
    await user.click(screen.getByText("Open settings"));
    await user.click(screen.getByLabelText("Draft"));
    await user.keyboard("{Escape}");
    expect(screen.getByLabelText("Draft")).toBeInTheDocument();
  });

  it("should accept matchTriggerWidth", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={trigger} matchTriggerWidth>
        Wide content
      </Popover>
    );
    await user.click(screen.getByText("Open settings"));
    expect(screen.getByText("Wide content")).toBeInTheDocument();
  });

  it("should apply an explicit zIndex to an in-flow panel", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={trigger} portal={false} zIndex={ZIndex.Low}>
        Low content
      </Popover>
    );
    await user.click(screen.getByText("Open settings"));
    expect(screen.getByText("Low content")).toHaveClass(
      zIndexStyles(ZIndex.Low)
    );
  });

  it("should leave focus alone when focusOnOpen is off", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={trigger} focusOnOpen={false}>
        <input aria-label="Quiet" />
      </Popover>
    );
    await user.click(screen.getByText("Open settings"));
    expect(screen.getByLabelText("Quiet")).not.toHaveFocus();
  });

  it("should accept every anchor", () => {
    for (const anchor of Object.values(PopoverAnchor)) {
      const { unmount } = render(
        <Popover trigger={trigger} anchor={anchor}>
          Anchored
        </Popover>
      );
      expect(screen.getByText("Open settings")).toBeInTheDocument();
      unmount();
    }
  });

  it("should pass className and HTML props to the root", () => {
    render(
      <Popover trigger={trigger} className="custom" data-testid="root">
        {null}
      </Popover>
    );
    expect(screen.getByTestId("root")).toHaveClass("custom");
  });

  it("should apply panelClassName to the panel", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={trigger} panelClassName="w-[360px]">
        Sized content
      </Popover>
    );

    await user.click(screen.getByText("Open settings"));
    expect(
      screen.getByText("Sized content").closest(".w-\\[360px\\]")
    ).not.toBeNull();
  });
});
