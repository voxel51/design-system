import { render, screen } from "@testing-library/react";

import { FormFieldGroup } from "./FormFieldGroup";

describe("FormFieldGroup", () => {
  let testId: string;

  beforeEach(() => {
    testId = Math.random().toString(36).substring(2, 9);
  });

  it("should render", () => {
    render(<FormFieldGroup data-testid={testId}></FormFieldGroup>);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});
