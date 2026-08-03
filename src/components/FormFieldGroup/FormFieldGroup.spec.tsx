import { render, screen } from "@testing-library/react";

import Orientation from "@/types/orientation.ts";
import { randomString } from "@/util/random";

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

  describe("row orientation", () => {
    it("caps the horizontal layout at two grid columns", () => {
      render(
        <FormFieldGroup data-testid={testId} orientation={Orientation.Row}>
          <div>field one</div>
          <div>field two</div>
        </FormFieldGroup>
      );

      const grid = screen.getByTestId(testId).firstElementChild;
      expect(grid).toHaveClass("grid-cols-1");
      expect(grid).toHaveClass("sm:grid-cols-2");
    });

    it("does not apply the grid layout for the default (column) orientation", () => {
      render(
        <FormFieldGroup data-testid={testId}>
          <div>field one</div>
        </FormFieldGroup>
      );

      const content = screen.getByTestId(testId).firstElementChild;
      expect(content).not.toHaveClass("grid");
    });
  });
});
