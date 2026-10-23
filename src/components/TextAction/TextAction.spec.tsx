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

  it("colors a danger tone as a failure", () => {
    render(<TextAction tone="danger">Stop import</TextAction>);

    expect(screen.getByRole("button")).toHaveClass("text-content-text-failure");
  });

  it("hides the label below 1024px when it collapses", () => {
    render(
      <TextAction collapse leadingIcon={IconName.Add} aria-label="Share">
        Share
      </TextAction>
    );

    expect(screen.getByText("Share")).toHaveClass("hidden", "lg:inline");
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("sizes by token", () => {
    render(<TextAction size={Size.Sm}>Upgrade</TextAction>);

    expect(screen.getByRole("button")).toHaveClass("h-7", "text-body-tertiary");
  });
});
