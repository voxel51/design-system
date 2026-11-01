import { fireEvent, render, screen } from "@testing-library/react";

import { IconName, Size } from "@/types";

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
});
