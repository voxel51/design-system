import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DropdownTrigger } from "@/components/Dropdown";

import { Popover } from "./Popover";

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
