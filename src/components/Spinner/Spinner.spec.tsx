import { render, screen } from "@testing-library/react";

import { Spinner } from "@/components/Spinner/Spinner";

import { randomString } from "#/testing-utils";

describe("Spinner", () => {
  let testId: string;
  let defaultProps: { "data-testid": string };

  beforeEach(() => {
    testId = randomString();
    defaultProps = { "data-testid": testId };
  });

  it("should render", () => {
    render(<Spinner {...defaultProps} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});
