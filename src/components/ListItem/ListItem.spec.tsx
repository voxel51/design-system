import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ListItem } from "./ListItem";

describe("ListItem", () => {
  let elementId: string;

  beforeEach(() => {
    elementId = Math.random().toString(36).substring(2, 9);
  });

  it("should render", () => {
    render(<ListItem data-testid={elementId} />);

    const element = screen.getByTestId(elementId);
    expect(element).toBeInTheDocument();
  });

  describe("canSelect", () => {
    describe("when true", () => {
      it("should render a checkbox", () => {
        render(<ListItem canSelect={true} data-testid={elementId} />);

        const element = screen.getByTestId(elementId);
        expect(element).toBeInTheDocument();

        const checkbox = within(element).getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
      });

      it("should respect the selected property", () => {
        [true, false].forEach((selected) => {
          const testId = `${elementId}-${selected}`;
          render(
            <ListItem
              canSelect={true}
              selected={selected}
              data-testid={testId}
            />
          );

          const element = screen.getByTestId(testId);
          expect(element).toBeInTheDocument();

          const checkbox = within(element).getByRole("checkbox");
          expect(checkbox).toBeInTheDocument();

          if (selected) {
            expect(checkbox).toBeChecked();
          } else {
            expect(checkbox).not.toBeChecked();
          }
        });
      });

      it("should emit onSelected events", async () => {
        const onSelected = jest.fn();
        render(
          <ListItem
            canSelect={true}
            onSelected={onSelected}
            data-testid={elementId}
          />
        );

        const element = screen.getByTestId(elementId);
        expect(element).toBeInTheDocument();

        const checkbox = within(element).getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();

        const user = userEvent.setup();

        await user.click(checkbox);

        expect(onSelected).toHaveBeenCalledWith(true);
      });
    });

    describe("when false", () => {
      it("should not render a checkbox", () => {
        render(<ListItem data-testid={elementId} />);

        const element = screen.getByTestId(elementId);
        expect(element).toBeInTheDocument();

        const checkbox = within(element).queryByRole("checkbox");
        expect(checkbox).not.toBeInTheDocument();
      });
    });
  });
});
