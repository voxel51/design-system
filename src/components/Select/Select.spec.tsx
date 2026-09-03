import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";

import { Descriptor } from "@/types";
import { randomString } from "@/util/random";

import { Select } from "./Select";

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

    it("should render options on click", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const input = within(screen.getByTestId(testId)).getByRole("combobox");

      await user.click(input);

      defaultProps.options.forEach((opt) =>
        expect(screen.getByText(opt.data.label)).toBeInTheDocument()
      );
    });

    it("should not render options when not focused", () => {
      render(<Select {...defaultProps} />);

      defaultProps.options.forEach((opt) =>
        expect(screen.queryByText(opt.data.label)).not.toBeInTheDocument()
      );
    });

    it("should render custom content", async () => {
      const user = userEvent.setup();
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

      await user.click(input);

      defaultProps.options.forEach((_, i) =>
        expect(screen.getByTestId(testIds[i])).toBeInTheDocument()
      );
    });
  });

  it("should close the list after an exclusive pick and keep the choice", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Select
        exclusive
        portal
        options={[
          { id: "a", data: { label: "Alpha" } },
          { id: "b", data: { label: "Beta" } },
        ]}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Alpha"));

    expect(onChange).toHaveBeenCalledWith("a");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  });

  it("should keep the list open after a pick when multiple are allowed", async () => {
    const user = userEvent.setup();
    render(
      <Select
        portal
        options={[
          { id: "a", data: { label: "Alpha" } },
          { id: "b", data: { label: "Beta" } },
        ]}
        onChange={jest.fn()}
      />
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Alpha"));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });
});
