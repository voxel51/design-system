import { render, screen } from "@testing-library/react";

import { TextLink } from "./TextLink";

describe("TextLink", () => {
  it("opens an external link in a new tab without a referrer", () => {
    render(
      <TextLink href="https://voxel51.com" external>
        Docs
      </TextLink>
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("stays in the page by default", () => {
    render(<TextLink href="/a">A</TextLink>);
    expect(screen.getByRole("link")).not.toHaveAttribute("target");
  });

  it("cuts a long link when truncated", () => {
    render(
      <TextLink href="/a" truncate>
        A
      </TextLink>
    );
    expect(screen.getByRole("link")).toHaveClass("truncate");
  });
});
