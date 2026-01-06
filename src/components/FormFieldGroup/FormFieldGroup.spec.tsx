import { randomString } from "@/util/random";
import { render, screen } from "@testing-library/react";

import { FormFieldGroup } from "./FormFieldGroup";

describe("FormFieldGroup", () => {
  let testId: string;

  beforeEach(() => {
    testId = randomString();
  });

  it("should render", () => {
    render(<FormFieldGroup data-testid={testId}></FormFieldGroup>);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});
