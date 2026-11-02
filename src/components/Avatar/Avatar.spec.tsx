import { render, screen } from "@testing-library/react";

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
});
