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
});
