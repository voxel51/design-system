import { fireEvent, render, screen } from "@testing-library/react";

import { IconName, Size } from "@/types";

import { TextAction } from "./TextAction";

describe("TextAction", () => {
  it("renders its label and icon as one button", () => {
    const onClick = jest.fn();
    render(
      <TextAction trailingIcon={IconName.ArrowUpRight} onClick={onClick}>
        Upgrade
      </TextAction>
    );

    const button = screen.getByRole("button", { name: "Upgrade" });
    expect(button.querySelector("svg")).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sizes by token", () => {
    render(<TextAction size={Size.Sm}>Upgrade</TextAction>);

    expect(screen.getByRole("button")).toHaveClass("h-[28px]", "text-md/5");
  });
});
