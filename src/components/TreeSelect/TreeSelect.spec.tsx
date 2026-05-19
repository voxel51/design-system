import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ZIndex } from "@/types";

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

function renderTreeSelect(overrides: Record<string, unknown> = {}) {
  const defaultProps = {
    root: vehicleTree,
    "data-testid": "tree-select",
    ...overrides,
  };
  return render(
    <TreeSelect {...(defaultProps as React.ComponentProps<typeof TreeSelect>)} />
  );
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

    it("does not expand branch children by default", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      expect(screen.queryByText("make")).not.toBeInTheDocument();
      expect(screen.queryByText("golf_cart")).not.toBeInTheDocument();
      expect(screen.queryByText("Honda")).not.toBeInTheDocument();
    });
  });

  describe("expand / collapse", () => {
    it("expands a branch when its chevron is clicked", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      expect(screen.queryByText("make")).not.toBeInTheDocument();

      await user.click(screen.getByLabelText("Expand car"));

      expect(screen.getByText("make")).toBeInTheDocument();
    });

    it("collapses a branch when its chevron is clicked again", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      await user.click(screen.getByLabelText("Expand car"));
      expect(screen.getByText("make")).toBeInTheDocument();

      await user.click(screen.getByLabelText("Collapse car"));
      expect(screen.queryByText("make")).not.toBeInTheDocument();
    });

    it("clicking a non-selectable row toggles expansion", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      await user.click(screen.getByLabelText("Expand car"));
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

      await user.click(screen.getByLabelText("Expand car"));
      const makeRow = screen.getByText("make");
      await user.click(makeRow);

      expect(onChange).not.toHaveBeenCalled();
    });

    it("does NOT fire onChange when a chevron is clicked on a selectable branch", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ onChange });

      await user.click(getInput());

      const chevron = screen.getByLabelText("Expand other");
      await user.click(chevron);

      expect(onChange).not.toHaveBeenCalled();
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

  });

  describe("deprecated styling", () => {
    it("renders a deprecated badge for deprecated nodes", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      await user.click(screen.getByLabelText("Expand car"));
      await user.click(screen.getByLabelText("Expand make"));
      await user.click(screen.getByLabelText("Expand Toyota"));

      const modelChevrons = screen.getAllByLabelText("Expand model");
      await user.click(modelChevrons[modelChevrons.length - 1]);

      expect(screen.getByText("Corolla")).toBeInTheDocument();
      expect(screen.getByText("deprecated")).toBeInTheDocument();
    });
  });

  describe("controlled value", () => {
    it("displays the node name for a controlled value", () => {
      renderTreeSelect({ value: "vehicle_type/motorcycle" });

      expect(getInput()).toHaveValue("motorcycle");
    });

    it("uses custom displayValue when provided", () => {
      renderTreeSelect({
        value: "vehicle_type/motorcycle",
        displayValue: (_path: string, node: TreeNode) =>
          node.name.toUpperCase(),
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

  describe("portal and z-index", () => {
    it("renders the panel outside the wrapper when portal is true", async () => {
      const user = userEvent.setup();
      render(
        <div data-testid="overflow-wrap" style={{ overflow: "hidden", height: 100 }}>
          <TreeSelect root={vehicleTree} portal />
        </div>
      );

      await user.click(screen.getByRole("combobox"));

      const tree = screen.getByRole("tree");
      expect(tree).toBeInTheDocument();
      expect(tree.closest('[data-testid="overflow-wrap"]')).toBeNull();
    });

    it("applies AboveModal z-index when portal is true without explicit zIndex", async () => {
      const user = userEvent.setup();
      renderTreeSelect({ portal: true });

      await user.click(getInput());

      const tree = screen.getByRole("tree");
      expect(tree.className).toContain("z-[var(--z-above-modal)]");
    });

    it("applies explicit zIndex when both portal and zIndex are provided", async () => {
      const user = userEvent.setup();
      renderTreeSelect({ portal: true, zIndex: ZIndex.High });

      await user.click(getInput());

      const tree = screen.getByRole("tree");
      expect(tree.className).not.toContain("z-[var(--z-above-modal)]");
      expect(tree.className).toContain("z-[var(--z-high)]");
    });

    it("renders the panel inline when portal is false", async () => {
      const user = userEvent.setup();
      render(
        <div data-testid="parent-wrap">
          <TreeSelect root={vehicleTree} data-testid="tree-select" />
        </div>
      );

      await user.click(screen.getByRole("combobox"));

      const tree = screen.getByRole("tree");
      expect(tree.closest('[data-testid="parent-wrap"]')).not.toBeNull();
    });

    it("sets proper ARIA attributes on the combobox input", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      const input = getInput();
      expect(input).toHaveAttribute("role", "combobox");
      expect(input).toHaveAttribute("aria-haspopup", "tree");
      expect(input).toHaveAttribute("aria-expanded", "false");

      await user.click(input);

      expect(input).toHaveAttribute("aria-expanded", "true");
      expect(input).toHaveAttribute("aria-controls");
    });
  });

  describe("keyboard navigation", () => {
    function getSearchInput() {
      return screen.getByLabelText("Search tree");
    }

    async function openPanel(user: ReturnType<typeof userEvent.setup>) {
      await user.click(getInput());
      // The component uses requestAnimationFrame to focus the search input.
      // Flush the rAF so keyboard events dispatch on the search input.
      await new Promise((r) => requestAnimationFrame(r));
    }

    it("activates the first row on initial open", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      const treeitems = screen.getAllByRole("treeitem");
      expect(treeitems[0]).toHaveAttribute("data-active", "true");
    });

    it("moves active down with ArrowDown", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      await user.keyboard("{ArrowDown}");

      const treeitems = screen.getAllByRole("treeitem");
      expect(treeitems[0]).not.toHaveAttribute("data-active");
      expect(treeitems[1]).toHaveAttribute("data-active", "true");
    });

    it("moves active up with ArrowUp", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowUp}");

      const treeitems = screen.getAllByRole("treeitem");
      expect(treeitems[0]).toHaveAttribute("data-active", "true");
    });

    it("stops at the end boundary on ArrowDown", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      // Root has 3 children: car, motorcycle, other
      await user.keyboard("{ArrowDown}{ArrowDown}");

      const treeitems = screen.getAllByRole("treeitem");
      expect(treeitems[2]).toHaveAttribute("data-active", "true");

      await user.keyboard("{ArrowDown}");
      expect(treeitems[2]).toHaveAttribute("data-active", "true");
    });

    it("stops at the start boundary on ArrowUp", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      const treeitems = screen.getAllByRole("treeitem");
      expect(treeitems[0]).toHaveAttribute("data-active", "true");

      await user.keyboard("{ArrowUp}");
      expect(treeitems[0]).toHaveAttribute("data-active", "true");
    });

    it("selects a selectable row on Enter", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ onChange });
      await openPanel(user);

      // First row is "car" which is selectable
      await user.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith("vehicle_type/car");
    });

    it("does not fire onChange on Enter for non-selectable row", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ onChange });
      await openPanel(user);

      // Expand "car" to reveal "make" (non-selectable)
      await user.keyboard("{ArrowRight}");
      // Move down to "make"
      await user.keyboard("{ArrowDown}");

      await user.keyboard("{Enter}");

      expect(onChange).not.toHaveBeenCalled();
    });

    it("expands a collapsed branch on ArrowRight", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      // "car" is active and collapsed
      expect(screen.queryByText("make")).not.toBeInTheDocument();

      await user.keyboard("{ArrowRight}");

      expect(screen.getByText("make")).toBeInTheDocument();
    });

    it("moves to first child on ArrowRight when branch is expanded", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      // Expand "car"
      await user.keyboard("{ArrowRight}");
      // ArrowRight again moves to first child ("make")
      await user.keyboard("{ArrowRight}");

      const makeItem = screen.getByText("make").closest('[role="treeitem"]');
      expect(makeItem).toHaveAttribute("data-active", "true");
    });

    it("is a no-op on ArrowRight for a leaf", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      // Move to "motorcycle" (leaf, index 1)
      await user.keyboard("{ArrowDown}");

      const treeitems = screen.getAllByRole("treeitem");
      expect(treeitems[1]).toHaveAttribute("data-active", "true");

      await user.keyboard("{ArrowRight}");
      expect(treeitems[1]).toHaveAttribute("data-active", "true");
    });

    it("collapses an expanded branch on ArrowLeft", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      // Expand "car"
      await user.keyboard("{ArrowRight}");
      expect(screen.getByText("make")).toBeInTheDocument();

      // Collapse "car"
      await user.keyboard("{ArrowLeft}");
      expect(screen.queryByText("make")).not.toBeInTheDocument();
    });

    it("moves to parent on ArrowLeft when collapsed", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      // Expand "car", move to "make"
      await user.keyboard("{ArrowRight}");
      await user.keyboard("{ArrowDown}");

      const makeItem = screen.getByText("make").closest('[role="treeitem"]');
      expect(makeItem).toHaveAttribute("data-active", "true");

      // ArrowLeft on collapsed "make" moves to parent "car"
      await user.keyboard("{ArrowLeft}");

      const carItem = screen.getByText("car").closest('[role="treeitem"]');
      expect(carItem).toHaveAttribute("data-active", "true");
    });

    it("closes the panel on Escape", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      expect(screen.getByRole("tree")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      expect(screen.queryByRole("tree")).not.toBeInTheDocument();
    });

    it("sets aria-activedescendant on the search input", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      const searchInput = getSearchInput();
      const activedesc = searchInput.getAttribute("aria-activedescendant");
      expect(activedesc).toBeTruthy();

      const activeRow = document.getElementById(activedesc!);
      expect(activeRow).not.toBeNull();
      expect(activeRow).toHaveAttribute("role", "treeitem");
    });

    it("navigates through expanded children in DOM order", async () => {
      const user = userEvent.setup();
      renderTreeSelect();
      await openPanel(user);

      // Expand "car"
      await user.keyboard("{ArrowRight}");
      // Now visible: car, make, motorcycle, other
      // Active is still "car", move down through all
      await user.keyboard("{ArrowDown}"); // make
      await user.keyboard("{ArrowDown}"); // motorcycle
      await user.keyboard("{ArrowDown}"); // other

      const otherItem = screen.getByText("other").closest('[role="treeitem"]');
      expect(otherItem).toHaveAttribute("data-active", "true");
    });
  });

  describe("defaultExpanded", () => {
    it("expands specified paths on open", async () => {
      const user = userEvent.setup();
      renderTreeSelect({
        defaultExpanded: new Set(["vehicle_type/car"]),
      });

      await user.click(getInput());

      expect(screen.getByText("make")).toBeInTheDocument();
    });

    it("expands all branches when true", async () => {
      const user = userEvent.setup();
      renderTreeSelect({ defaultExpanded: true });

      await user.click(getInput());

      expect(screen.getByText("make")).toBeInTheDocument();
      expect(screen.getByText("Honda")).toBeInTheDocument();
      expect(screen.getByText("golf_cart")).toBeInTheDocument();
    });

    it("allows collapsing a default-expanded path", async () => {
      const user = userEvent.setup();
      renderTreeSelect({
        defaultExpanded: new Set(["vehicle_type/car"]),
      });

      await user.click(getInput());
      expect(screen.getByText("make")).toBeInTheDocument();

      await user.click(screen.getByLabelText("Collapse car"));
      expect(screen.queryByText("make")).not.toBeInTheDocument();
    });

    it("restores default expansion on panel re-open", async () => {
      const user = userEvent.setup();
      renderTreeSelect({
        defaultExpanded: new Set(["vehicle_type/car"]),
      });

      await user.click(getInput());
      expect(screen.getByText("make")).toBeInTheDocument();

      await user.click(screen.getByLabelText("Collapse car"));
      expect(screen.queryByText("make")).not.toBeInTheDocument();

      // Close by toggling the trigger
      await user.click(getInput());
      expect(screen.queryByRole("tree")).not.toBeInTheDocument();

      // Re-open — default expansion should be restored
      await user.click(getInput());
      expect(screen.getByText("make")).toBeInTheDocument();
    });
  });

  describe("search", () => {
    function getSearchInput() {
      return screen.getByLabelText("Search tree");
    }

    it("renders a search bar inside the panel", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());

      expect(getSearchInput()).toBeInTheDocument();
    });

    it("filters the tree to show only matching paths", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());
      await user.type(getSearchInput(), "Civic");

      expect(await screen.findByText("Civic")).toBeInTheDocument();
      expect(screen.queryByText("Accord")).not.toBeInTheDocument();
      expect(screen.queryByText("motorcycle")).not.toBeInTheDocument();
      expect(screen.queryByText("other")).not.toBeInTheDocument();
    });

    it("shows 'No matches found' when query has no results", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());
      await user.type(getSearchInput(), "zzz_no_match");

      expect(await screen.findByText("No matches found")).toBeInTheDocument();
      expect(screen.queryByText("car")).not.toBeInTheDocument();
    });

    it("auto-expands ancestors so the match is visible", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());
      await user.type(getSearchInput(), "Civic");

      expect(await screen.findByText("Civic")).toBeInTheDocument();
      expect(screen.getByText("car")).toBeInTheDocument();
      expect(screen.getByText("make")).toBeInTheDocument();
      expect(screen.getByText("Honda")).toBeInTheDocument();
      expect(screen.getByText("model")).toBeInTheDocument();
    });

    it("shows non-selectable nodes when their name matches", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());
      await user.type(getSearchInput(), "make");

      expect(await screen.findByText("make")).toBeInTheDocument();
    });

    it("clears the search when the clear button is clicked", async () => {
      const user = userEvent.setup();
      renderTreeSelect();

      await user.click(getInput());
      await user.type(getSearchInput(), "Civic");

      expect(await screen.findByText("Civic")).toBeInTheDocument();
      expect(screen.queryByText("motorcycle")).not.toBeInTheDocument();

      await user.click(screen.getByLabelText("Clear search"));

      expect(screen.getByText("car")).toBeInTheDocument();
      expect(screen.getByText("motorcycle")).toBeInTheDocument();
      expect(screen.getByText("other")).toBeInTheDocument();
    });

    it("clears the query when the selection clear button fires", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeSelect({ value: "vehicle_type/motorcycle", onChange });

      await user.click(getInput());
      await user.type(getSearchInput(), "car");

      await user.click(screen.getByLabelText("Clear selection"));

      expect(onChange).toHaveBeenCalledWith(null);
    });
  });

  describe("multi-select", () => {
    function renderMulti(overrides: Record<string, unknown> = {}) {
      return renderTreeSelect({ multiple: true, ...overrides });
    }

    it("renders pills for selected values", () => {
      renderMulti({
        value: ["vehicle_type/car", "vehicle_type/motorcycle"],
      });

      expect(screen.getByText("car")).toBeInTheDocument();
      expect(screen.getByText("motorcycle")).toBeInTheDocument();
    });

    it("fires onChange with the toggled-in path on first selection", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderMulti({ onChange });

      await user.click(getInput());
      await user.click(screen.getByText("car"));

      expect(onChange).toHaveBeenCalledWith(["vehicle_type/car"]);
    });

    it("fires onChange with cumulative array on additional selections", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderMulti({
        value: ["vehicle_type/car"],
        onChange,
      });

      await user.click(getInput());
      await user.click(screen.getByText("motorcycle"));

      expect(onChange).toHaveBeenCalledWith([
        "vehicle_type/car",
        "vehicle_type/motorcycle",
      ]);
    });

    it("deselects a path when clicking an already-selected row", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderMulti({
        value: ["vehicle_type/car", "vehicle_type/motorcycle"],
        onChange,
      });

      await user.click(getInput());
      const selectedItems = screen.getAllByRole("treeitem", {
        selected: true,
      });
      await user.click(selectedItems[0]);

      expect(onChange).toHaveBeenCalledWith(["vehicle_type/motorcycle"]);
    });

    it("removes a path when clicking the pill remove button", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderMulti({
        value: ["vehicle_type/car", "vehicle_type/motorcycle"],
        onChange,
      });

      const removeButtons = screen.getAllByLabelText("Remove");
      await user.click(removeButtons[0]);

      expect(onChange).toHaveBeenCalledWith(["vehicle_type/motorcycle"]);
    });

    it("clears all selections when the clear button is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderMulti({
        value: ["vehicle_type/car", "vehicle_type/motorcycle"],
        onChange,
      });

      await user.click(screen.getByLabelText("Clear selection"));

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it("keeps the panel open after selection", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderMulti({ onChange });

      await user.click(getInput());
      expect(screen.getByRole("tree")).toBeInTheDocument();

      await user.click(screen.getByText("motorcycle"));

      expect(screen.getByRole("tree")).toBeInTheDocument();
    });

    it("renders checkboxes in multi mode instead of check icons", async () => {
      const user = userEvent.setup();
      renderMulti({
        value: ["vehicle_type/car"],
      });

      await user.click(getInput());

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it("renders check icon in single mode (not checkboxes)", async () => {
      const user = userEvent.setup();
      renderTreeSelect({ value: "vehicle_type/car" });

      await user.click(getInput());

      expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    });

    it("works with leavesOnly — branches non-selectable, leaves toggleable", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderMulti({ leavesOnly: true, onChange });

      await user.click(getInput());

      await user.click(screen.getByText("car"));
      expect(onChange).not.toHaveBeenCalled();

      await user.click(screen.getByText("motorcycle"));
      expect(onChange).toHaveBeenCalledWith(["vehicle_type/motorcycle"]);
    });

    it("shows placeholder when no values are selected", () => {
      renderMulti({ placeholder: "Pick vehicles" });

      expect(screen.getByText("Pick vehicles")).toBeInTheDocument();
    });

    it("hides placeholder when values are selected", () => {
      renderMulti({
        value: ["vehicle_type/car"],
        placeholder: "Pick vehicles",
      });

      expect(screen.queryByText("Pick vehicles")).not.toBeInTheDocument();
    });
  });
});
