import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { TreeNode } from "./types";
import { TreeSelect } from "./TreeSelect";

const vehicleTree: TreeNode = {
  name: "vehicle_type",
  description: "The type of vehicle",
  values: [
    {
      name: "car",
      description: "Passenger car",
      values: [
        {
          name: "make",
          can_select: false,
          values: [
            {
              name: "Honda",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [{ name: "Civic" }, { name: "Accord" }],
                },
              ],
            },
            {
              name: "Toyota",
              description: "Toyota Motor Co.",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [
                    { name: "Camry" },
                    { name: "Corolla", deprecated: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "motorcycle",
      description: "Two-wheeled motor vehicle",
    },
    {
      name: "other",
      description: "Less common vehicle types",
      values: [{ name: "golf_cart" }, { name: "atv" }],
    },
  ],
};

function renderTreeSelect(
  overrides: Partial<React.ComponentProps<typeof TreeSelect>> = {}
) {
  const defaultProps = {
    root: vehicleTree,
    "data-testid": "tree-select",
    ...overrides,
  };
  return render(<TreeSelect {...defaultProps} />);
}

function getInput() {
  return screen.getByRole("combobox");
}

describe("TreeSelect", () => {
  describe("rendering", () => {
    it("renders the component", () => {
      renderTreeSelect();
      expect(screen.getByTestId("tree-select")).toBeInTheDocument();
    });

    it("renders the combobox input", () => {
      renderTreeSelect();
      expect(getInput()).toBeInTheDocument();
    });

    it("renders placeholder text", () => {
      renderTreeSelect({ placeholder: "Pick a vehicle" });
      expect(getInput()).toHaveAttribute("placeholder", "Pick a vehicle");
    });

    it("does not show tree nodes before opening", () => {
      renderTreeSelect();
      expect(screen.queryByText("car")).not.toBeInTheDocument();
      expect(screen.queryByText("motorcycle")).not.toBeInTheDocument();
    });
  });

  describe("opening the panel", () => {
    it("shows root-level children on click", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      expect(screen.getByText("car")).toBeInTheDocument();
      expect(screen.getByText("motorcycle")).toBeInTheDocument();
      expect(screen.getByText("other")).toBeInTheDocument();
    });

    it("shows expanded first-level children (depth 0 defaults open)", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      expect(screen.getByText("make")).toBeInTheDocument();
      expect(screen.getByText("golf_cart")).toBeInTheDocument();
      expect(screen.getByText("atv")).toBeInTheDocument();
    });

    it("does not show deeply nested nodes (depth > 0 defaults closed)", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      expect(screen.queryByText("Honda")).not.toBeInTheDocument();
      expect(screen.queryByText("Civic")).not.toBeInTheDocument();
    });
  });

  describe("expand / collapse", () => {
    it("expands a branch when its chevron is clicked", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      expect(screen.queryByText("Honda")).not.toBeInTheDocument();

      const makeChevron = screen.getByLabelText("Expand make");
      await user.click(makeChevron);

      expect(screen.getByText("Honda")).toBeInTheDocument();
      expect(screen.getByText("Toyota")).toBeInTheDocument();
    });

    it("collapses a branch when its chevron is clicked again", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      const expandBtn = screen.getByLabelText("Expand make");
      await user.click(expandBtn);
      expect(screen.getByText("Honda")).toBeInTheDocument();

      const collapseBtn = screen.getByLabelText("Collapse make");
      await user.click(collapseBtn);
      expect(screen.queryByText("Honda")).not.toBeInTheDocument();
    });

    it("clicking a non-selectable row toggles expansion", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      expect(screen.queryByText("Honda")).not.toBeInTheDocument();

      const makeRow = screen.getByText("make");
      await user.click(makeRow);

      expect(screen.getByText("Honda")).toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("fires onChange with the node path when a selectable leaf is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ onChange });

      await user.click(getInput());

      await user.click(screen.getByText("motorcycle"));

      expect(onChange).toHaveBeenCalledWith("vehicle_type/motorcycle");
    });

    it("fires onChange with the path when a selectable branch is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ onChange });

      await user.click(getInput());
      await user.click(screen.getByText("car"));

      expect(onChange).toHaveBeenCalledWith("vehicle_type/car");
    });

    it("does NOT fire onChange when a non-selectable branch row is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ onChange });

      await user.click(getInput());

      const makeRow = screen.getByText("make");
      await user.click(makeRow);

      expect(onChange).not.toHaveBeenCalled();
    });

    it("does NOT fire onChange when a chevron is clicked on a selectable branch", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ onChange });

      await user.click(getInput());

      const chevron = screen.getByLabelText("Collapse other");
      await user.click(chevron);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("typeahead / search", () => {
    it("shows flat search results when typing a query", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());
      await user.type(getInput(), "Civic");

      expect(screen.getByText(/Civic/)).toBeInTheDocument();
    });

    it("excludes non-selectable nodes from search results", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());
      await user.type(getInput(), "make");

      expect(screen.queryByText(/\bmake\b/)).not.toBeInTheDocument();
    });

    it("fires onChange with full path from flat search selection", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ onChange });

      await user.click(getInput());
      await user.type(getInput(), "motorcycle");

      const option = screen.getByText(/motorcycle/);
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith("vehicle_type/motorcycle");
    });
  });

  describe("leavesOnly", () => {
    it("makes branch nodes non-selectable", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ leavesOnly: true, onChange });

      await user.click(getInput());

      await user.click(screen.getByText("car"));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("allows leaf node selection", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ leavesOnly: true, onChange });

      await user.click(getInput());
      await user.click(screen.getByText("motorcycle"));

      expect(onChange).toHaveBeenCalledWith("vehicle_type/motorcycle");
    });

    it("excludes branches from search results", async () => {
      const user = userEvent.setup();
      renderTreeSelect({ leavesOnly: true });

      await user.click(getInput());
      await user.type(getInput(), "other");

      expect(screen.queryByText(/\bother\b/)).not.toBeInTheDocument();
    });
  });

  describe("deprecated styling", () => {
    it("renders a deprecated badge for deprecated nodes", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      await user.click(screen.getByLabelText("Expand make"));
      await user.click(screen.getByLabelText("Expand Toyota"));

      const modelChevrons = screen.getAllByLabelText("Expand model");
      await user.click(modelChevrons[modelChevrons.length - 1]);

      expect(screen.getByText("Corolla")).toBeInTheDocument();
      expect(screen.getByText("deprecated")).toBeInTheDocument();
    });
  });

  describe("controlled value", () => {
    it("displays the breadcrumb for a controlled value", () => {
      renderTreeSelect({ value: "vehicle_type/motorcycle" });

      expect(getInput()).toHaveValue(
        "vehicle_type / motorcycle"
      );
    });

    it("uses custom displayValue when provided", () => {
      renderTreeSelect({
        value: "vehicle_type/motorcycle",
        displayValue: (_path, node) => node.name.toUpperCase(),
      });

      expect(getInput()).toHaveValue("MOTORCYCLE");
    });
  });

  describe("disabled state", () => {
    it("disables the input when disabled prop is true", () => {
      renderTreeSelect({ disabled: true });
      expect(getInput()).toBeDisabled();
    });
  });
});
