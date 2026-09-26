import { render, screen, within } from "@testing-library/react";

import { TextColor, TextVariant } from "@/types";
import { randomString } from "@/util/random";

import { LoadingScreen } from "./LoadingScreen";

describe("LoadingScreen", () => {
  let testId: string;

  beforeEach(() => {
    testId = randomString();
  });

  it("should render what it is waiting on", () => {
    render(<LoadingScreen data-testid={testId} text="Loading" />);

    expect(screen.getByTestId(testId)).toHaveTextContent("Loading");
  });

  it("should report itself as a status", () => {
    render(<LoadingScreen data-testid={testId} text="Loading" />);

    expect(
      within(screen.getByTestId(testId)).getByRole("status")
    ).toBeInTheDocument();
  });

  it("should fill the region it is given", () => {
    render(<LoadingScreen data-testid={testId} text="Loading" />);

    expect(screen.getByTestId(testId)).toHaveClass("h-full", "w-full");
  });

  it("should take a caller's size and color", () => {
    render(
      <LoadingScreen
        color={TextColor.Tertiary}
        data-testid={testId}
        text="Loading"
        variant={TextVariant.Sm}
      />
    );

    const status = within(screen.getByTestId(testId)).getByRole("status");
    expect(status).toHaveClass("text-content-text-tertiary", "text-sm/5");
  });
});
