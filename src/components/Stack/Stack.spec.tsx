import { render, screen } from "@testing-library/react";

import { Stack } from "@/components/Stack/Stack.tsx";
import { Spacing } from "@/types";
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

  it("should pad every side", () => {
    render(<Stack data-testid={testId} padding={Spacing.Md}></Stack>);

    expect(screen.getByTestId(testId)).toHaveClass("p-md");
  });

  it("should pad one axis at a time", () => {
    render(
      <Stack
        data-testid={testId}
        paddingX={Spacing.Lg}
        paddingY={Spacing.Xs}
      ></Stack>
    );

    expect(screen.getByTestId(testId)).toHaveClass("px-lg", "py-xs");
  });

  it("should keep an axis override beside the all-sides padding", () => {
    render(
      <Stack
        data-testid={testId}
        padding={Spacing.Md}
        paddingX={Spacing.None}
      ></Stack>
    );

    expect(screen.getByTestId(testId)).toHaveClass("p-md", "px-0");
  });

  it("should not pad without the props", () => {
    render(<Stack data-testid={testId}></Stack>);

    expect(screen.getByTestId(testId).className).not.toMatch(/\bp[xy]?-/);
  });
});
