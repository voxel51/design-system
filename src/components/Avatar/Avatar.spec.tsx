import { fireEvent, render, screen } from "@testing-library/react";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("shows initials without an image", () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveTextContent(
      "AL"
    );
  });

  it("shows the image when given one", () => {
    const { container } = render(
      <Avatar name="Ada" src="/ada.png" size="lg" />
    );

    expect(container.querySelector("img")).toHaveAttribute("src", "/ada.png");
    expect(screen.getByRole("img", { name: "Ada" })).toHaveClass("size-8");
  });

  it("shows the name beside the avatar with showName", () => {
    const { container } = render(
      <Avatar name="Ada Lovelace" size="sm" showName />
    );

    expect(screen.getByText("Ada Lovelace")).toHaveClass("truncate");
    expect(container.querySelector('[role="img"]')).toHaveTextContent("AL");
    expect(container.querySelector('[role="img"]')).toHaveClass("size-5");
  });

  it("fills from the name by default and neutral on request", () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" />);
    const fill = screen.getByRole("img").style.backgroundColor;
    expect(fill).not.toBe("");
    expect(["rgb(255, 255, 255)", "rgb(17, 17, 17)"]).toContain(
      screen.getByRole("img").style.color
    );

    rerender(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole("img").style.backgroundColor).toBe(fill);

    rerender(<Avatar name="Ada Lovelace" tone="neutral" />);
    expect(screen.getByRole("img").style.backgroundColor).toBe("");
  });

  it("shows an icon on the neutral fill in place of the initials", () => {
    render(<Avatar name="ada@example.com" icon={<svg data-testid="mail" />} />);

    const avatar = screen.getByRole("img", { name: "ada@example.com" });
    expect(screen.getByTestId("mail")).toBeInTheDocument();
    expect(avatar).not.toHaveTextContent("A");
    expect(avatar.style.backgroundColor).toBe("");
  });

  it("falls back to the initials when the image fails", () => {
    const { container } = render(<Avatar name="Ada Lovelace" src="/x.png" />);

    fireEvent.error(container.querySelector("img")!);

    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("img")).toHaveTextContent("AL");
  });
});
