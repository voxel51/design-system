import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  const badgeText = "Badge text";

  it("should render with text", () => {
    render(<Badge>{badgeText}</Badge>);
    expect(screen.getByText(badgeText)).toBeInTheDocument();
  });

  it("should pass through additional props to the component", () => {
    render(
      <Badge id="test-badge" data-testid="custom-badge">
        {badgeText}
      </Badge>
    );

    const badge = screen.getByTestId("custom-badge");
    expect(badge).toHaveAttribute("id", "test-badge");
    expect(badge).toHaveAttribute("data-testid", "custom-badge");
  });
});
