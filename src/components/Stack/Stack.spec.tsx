import { render, screen } from "@testing-library/react";

import { Stack } from "@/components/Stack/Stack.tsx";

describe("Stack", () => {
  let testId: string;

  beforeEach(() => {
    testId = Math.random().toString(36).substring(2, 9);
  });

  it("should render", () => {
    render(<Stack data-testid={testId}></Stack>);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});
