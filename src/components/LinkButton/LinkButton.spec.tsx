import { fireEvent, render, screen } from "@testing-library/react";

import { Size } from "@/types";

import { LinkButton } from "./LinkButton";

describe("LinkButton", () => {
  it("renders a button that fires onClick", () => {
    const onClick = jest.fn();
    render(<LinkButton onClick={onClick}>Try again</LinkButton>);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an anchor when href is set", () => {
    render(
      <LinkButton href="https://example.com" target="_blank">
        Docs
      </LinkButton>
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("sizes by the type roles", () => {
    render(<LinkButton size={Size.Lg}>Large</LinkButton>);
    expect(screen.getByRole("button")).toHaveClass("text-body-primary");
  });
});
