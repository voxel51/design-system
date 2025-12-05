import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  const badgeText = "Badge text";

  it("should render with text", () => {
    render(<Badge>{badgeText}</Badge>);
    expect(screen.getByText(badgeText)).toBeInTheDocument();
  });
});
