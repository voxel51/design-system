import { fireEvent, render, screen, within } from "@testing-library/react";
import { Select } from "./Select";
import { ReactNode } from "react";
import { Descriptor } from "@/types";
import { randomString } from "#/testing-utils";

describe("Select", () => {
  let testId: string;
  let defaultProps: {
    "data-testid": string;
    options: Descriptor<{ label: string; content?: ReactNode }>[];
  };

  beforeEach(() => {
    testId = Math.random().toString(36).substring(2, 9);
    defaultProps = { "data-testid": testId, options: [] };
  });

  it("should render", () => {
    render(<Select {...defaultProps} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  describe("with options", () => {
    beforeEach(() => {
      defaultProps.options = new Array(3)
        .fill(0)
        .map(() => ({ id: randomString(), data: { label: randomString() } }));
    });

    it("should render options on focus", () => {
      render(<Select {...defaultProps} />);

      const input = within(screen.getByTestId(testId)).getByRole("combobox");

      fireEvent.focus(input);

      defaultProps.options.forEach((opt) =>
        expect(screen.getByText(opt.data.label)).toBeInTheDocument()
      );

      fireEvent.blur(input);

      defaultProps.options.forEach((opt) =>
        expect(screen.queryByText(opt.data.label)).not.toBeInTheDocument()
      );
    });

    it("should not render options when not focused", () => {
      render(<Select {...defaultProps} />);

      defaultProps.options.forEach((opt) =>
        expect(screen.queryByText(opt.data.label)).not.toBeInTheDocument()
      );
    });

    it("should render custom content", () => {
      const testIds: string[] = [];
      defaultProps.options = new Array(3).fill(0).map(() => {
        const contentId = randomString();
        testIds.push(contentId);
        return {
          id: randomString(),
          data: {
            label: randomString(),
            content: <div data-testid={contentId}></div>,
          },
        };
      });

      render(<Select {...defaultProps} />);

      const input = within(screen.getByTestId(testId)).getByRole("combobox");

      fireEvent.focus(input);

      defaultProps.options.forEach((_, i) =>
        expect(screen.getByTestId(testIds[i])).toBeInTheDocument()
      );
    });
  });
});
