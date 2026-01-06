import { randomString } from "@/util/random";
import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";

import { FormField } from "./FormField";

describe("FormField", () => {
  let testId: string;
  let defaultProps: { "data-testid": string; control: ReactNode };

  beforeEach(() => {
    testId = randomString();
    defaultProps = {
      "data-testid": testId,
      control: <input />,
    };
  });

  it("should render", () => {
    render(<FormField {...defaultProps} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it("should render the provided control", () => {
    const controlId = randomString();
    render(
      <FormField
        {...defaultProps}
        control={<input data-testid={controlId} />}
      />
    );

    const field = screen.getByTestId(testId);
    expect(within(field).getByTestId(controlId)).toBeInTheDocument();
  });

  it("should render the provided label", () => {
    const label = randomString();
    render(<FormField {...defaultProps} label={label} />);

    const field = screen.getByTestId(testId);
    expect(within(field).getByText(label)).toBeInTheDocument();
  });

  it("should render the provided label and description", () => {
    const label = randomString();
    const description = randomString();
    render(
      <FormField {...defaultProps} label={label} description={description} />
    );

    const field = screen.getByTestId(testId);
    expect(within(field).getByText(label)).toBeInTheDocument();
    expect(within(field).getByText(description)).toBeInTheDocument();
  });

  it("should not render the provided description without a label", () => {
    const description = randomString();
    render(<FormField {...defaultProps} description={description} />);

    const field = screen.getByTestId(testId);
    expect(within(field).queryByText(description)).not.toBeInTheDocument();
  });

  it("should render the provided error message", () => {
    const error = randomString();
    render(<FormField {...defaultProps} error={error} />);

    const field = screen.getByTestId(testId);
    expect(within(field).getByText(error)).toBeInTheDocument();
  });
});
