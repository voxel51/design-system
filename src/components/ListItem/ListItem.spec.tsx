import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { randomString } from "@/util/random";

import { ListItem } from "./ListItem";

describe("ListItem", () => {
  let elementId: string;

  beforeEach(() => {
    elementId = randomString();
  });

  it("should render", () => {
    render(<ListItem data-testid={elementId} />);

    const element = screen.getByTestId(elementId);
    expect(element).toBeInTheDocument();
  });

  describe("long text", () => {
    it("should truncate a string name and detail on one line", () => {
      render(
        <ListItem
          primaryContent="A long name"
          secondaryContent="A long detail"
        />
      );

      expect(screen.getByText("A long name").className).toContain("truncate");
      expect(screen.getByText("A long detail").className).toContain("truncate");
    });

    it("should cap the name at 70% only beside a detail", () => {
      const capped = () =>
        screen.getByText("A long name").closest(".max-w-\\[70\\%\\]");
      const { rerender } = render(
        <ListItem primaryContent="A long name" secondaryContent="Detail" />
      );
      expect(capped()).toHaveClass("shrink-0");

      rerender(<ListItem primaryContent="A long name" />);
      expect(capped()).toBeNull();
    });
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

  describe("size", () => {
    it("renders the dense row at sm", () => {
      render(<ListItem size="sm" data-testid={elementId} />);

      expect(screen.getByTestId(elementId)).toHaveClass("py-2");
    });

    it("renders the roomy row by default", () => {
      render(<ListItem data-testid={elementId} />);

      expect(screen.getByTestId(elementId)).toHaveClass("py-3");
    });
  });
});
