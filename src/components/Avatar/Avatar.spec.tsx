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

  it("puts an icon on the muted fill, even with a colorKey", () => {
    render(<Avatar name="Labelers" colorKey="g1" icon={<svg />} />);

    expect(screen.getByRole("img").style.getPropertyValue("--avatar-bg")).toBe(
      ""
    );
    expect(screen.getByRole("img")).toHaveClass("bg-content-bg-card-nested");
  });

  it("puts a subtitle under the name", () => {
    render(
      <Avatar name="Ada Lovelace" size="lg" showName subtitle="ada@x.com" />
    );

    expect(screen.getByText("Ada Lovelace")).toHaveClass("truncate");
    expect(screen.getByText("ada@x.com")).toHaveClass("truncate");
  });

  it("tints by default and neutral on request", () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" />);
    const fill = screen.getByRole("img").style.getPropertyValue("--avatar-bg");
    expect(fill).not.toBe("");

    rerender(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole("img").style.getPropertyValue("--avatar-bg")).toBe(
      fill
    );

    rerender(<Avatar name="Ada Lovelace" tone="neutral" />);
    expect(screen.getByRole("img").style.getPropertyValue("--avatar-bg")).toBe(
      ""
    );
  });

  it("shows an icon on the neutral fill in place of the initials", () => {
    render(<Avatar name="ada@example.com" icon={<svg data-testid="mail" />} />);

    const avatar = screen.getByRole("img", { name: "ada@example.com" });
    expect(screen.getByTestId("mail")).toBeInTheDocument();
    expect(avatar).not.toHaveTextContent("A");
    expect(avatar.style.getPropertyValue("--avatar-bg")).toBe("");
  });

  it("falls back to the initials when the image fails", () => {
    const { container } = render(<Avatar name="Ada Lovelace" src="/x.png" />);

    fireEvent.error(container.querySelector("img")!);

    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("img")).toHaveTextContent("AL");
  });

  it("picks the colour from colorKey, not the name", () => {
    const fill = (props: { name: string; colorKey?: string }) => {
      const { unmount } = render(<Avatar {...props} />);
      const value = screen
        .getByRole("img")
        .style.getPropertyValue("--avatar-bg");
      unmount();
      return value;
    };

    expect(fill({ name: "Test User", colorKey: "a@example.com" })).toBe(
      fill({ name: "Someone Else", colorKey: "a@example.com" })
    );
    expect(fill({ name: "Test User" })).toBe(fill({ name: "Tom Uno" }));
  });

  it("draws a group as a rounded square", () => {
    render(<Avatar name="Annotators" square />);

    expect(screen.getByRole("img")).not.toHaveClass("rounded-full");
  });
});
