import { render, screen } from "@testing-library/react";

import { Stack } from "@/components/Stack/Stack.tsx";
import { randomString } from "@/util/random";

describe("Stack", () => {
  let testId: string;

  beforeEach(() => {
    testId = randomString();
  });

  it("should render", () => {
    render(<Stack data-testid={testId}></Stack>);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it("wraps its children only when asked", () => {
    const { rerender } = render(<Stack data-testid={testId} />);
    expect(screen.getByTestId(testId)).not.toHaveClass("flex-wrap");

    rerender(<Stack data-testid={testId} wrap />);
    expect(screen.getByTestId(testId)).toHaveClass("flex-wrap");
  });
});
