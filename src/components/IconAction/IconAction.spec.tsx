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
});
