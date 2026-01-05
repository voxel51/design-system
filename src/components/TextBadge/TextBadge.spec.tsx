import { randomString } from "@/util/random";
import { render, screen, within } from "@testing-library/react";
import { TextBadge } from "./TextBadge";

describe("TextBadge", () => {
  let testId: string;
  let defaultProps: { "data-testid": string };

  beforeEach(() => {
    testId = randomString();
    defaultProps = { "data-testid": testId };
  });

  it("should render", () => {
    render(<TextBadge {...defaultProps}></TextBadge>);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it("should render children", () => {
    const content = randomString();
    render(<TextBadge {...defaultProps}>{content}</TextBadge>);

    expect(
      within(screen.getByTestId(testId)).getByText(content)
    ).toBeInTheDocument();
  });
});
