import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown, DropdownTrigger } from "@/components/Dropdown";
import { IconName, Size } from "@/types";
import { MENU_FIT, OverflowRowCompactContext } from "@/util/compact";


import { IconAction } from "./IconAction";

describe("IconAction", () => {
  it("is a labelled icon-only button", () => {
    const onClick = jest.fn();
    render(
      <IconAction
        icon={IconName.Close}
        aria-label="Dismiss"
        onClick={onClick}
      />
    );

    const button = screen.getByRole("button", { name: "Dismiss" });
    expect(button.querySelector("svg")).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sizes by token", () => {
    render(
      <IconAction icon={IconName.Close} aria-label="Dismiss" size={Size.Sm} />
    );

    expect(screen.getByRole("button")).toHaveClass("size-[26px]");
  });

  it("has an xs size for dense inline affordances", () => {
    render(<IconAction icon={IconName.Add} aria-label="Add stage" size="xs" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("size-4");
    expect(button.querySelector("svg")).toHaveAttribute("width", "10");
  });

  it("tints toward the brand on hover with the brand tone", () => {
    render(<IconAction icon={IconName.Add} aria-label="Pin" tone="brand" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-brand-primary/15");
    expect(button).not.toHaveClass("bg-content-bg-card-nested");
  });

  it("fills with the danger colour on hover with the danger tone", () => {
    render(
      <IconAction icon={IconName.Close} aria-label="Remove" tone="danger" />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:text-white");
    expect(button).toHaveClass(
      "hover:bg-[var(--color-content-interactive-danger-hover)]"
    );
  });

  it("names itself and its hint in a tooltip", () => {
    render(
      <IconAction
        icon={IconName.Close}
        aria-label="Delete"
        tooltip
        hint="Archived"
        disabled
      />
    );
    fireEvent.mouseEnter(screen.getByRole("button").parentElement as Element);
    expect(screen.getByRole("tooltip")).toHaveTextContent("DeleteArchived");
  });

  it("has no tooltip unless asked", () => {
    const { container } = render(
      <IconAction icon={IconName.Close} aria-label="Dismiss" />
    );
    expect(container.firstElementChild).toBe(screen.getByRole("button"));
  });

  it("is a labelled menu row inside an overflow menu", async () => {
    const onClick = jest.fn();
    render(
      <Dropdown trigger={<DropdownTrigger>More</DropdownTrigger>}>
        <OverflowRowCompactContext.Provider value={MENU_FIT}>
          <IconAction
            icon={IconName.Close}
            aria-label="Delete snapshot"
            tone="danger"
            onClick={onClick}
          />
        </OverflowRowCompactContext.Provider>
      </Dropdown>
    );
    await userEvent.click(screen.getByText("More"));
    const item = await screen.findByRole("menuitem", {
      name: "Delete snapshot",
    });
    await userEvent.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
