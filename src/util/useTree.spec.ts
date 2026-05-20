import { act, renderHook } from "@testing-library/react";

import { buildResolvedTree } from "@/components/TreeSelect/tree";
import type { TreeNode } from "@/components/TreeSelect/types";

import { useTree, type UseTreeOptions } from "./useTree";

const vehicleTree: TreeNode = {
  name: "vehicle_type",
  values: [
    {
      name: "car",
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
            { name: "Toyota" },
          ],
        },
      ],
    },
    { name: "motorcycle" },
    { name: "other", values: [{ name: "golf_cart" }, { name: "atv" }] },
  ],
};

const resolved = buildResolvedTree(vehicleTree);

function setup(overrides: Partial<UseTreeOptions> = {}) {
  return renderHook((props: Partial<UseTreeOptions>) =>
    useTree({
      tree: resolved,
      scrollActiveIntoView: false,
      ...overrides,
      ...props,
    })
  );
}

function fakeKeyEvent(key: string) {
  return { key, preventDefault: jest.fn() } as unknown as React.KeyboardEvent;
}

describe("useTree", () => {
  describe("visibleNodes", () => {
    it("returns only root children when nothing is expanded", () => {
      const { result } = setup();
      const names = result.current.visibleNodes.map((n) => n.node.name);
      expect(names).toEqual(["car", "motorcycle", "other"]);
    });

    it("includes children of expanded branches", () => {
      const { result } = setup();
      act(() => result.current.expand("vehicle_type/car"));
      const names = result.current.visibleNodes.map((n) => n.node.name);
      expect(names).toEqual(["car", "make", "motorcycle", "other"]);
    });

    it("respects forceOpenPaths", () => {
      const forceOpenPaths = new Set(["vehicle_type/car"]);
      const { result } = setup({ forceOpenPaths });
      const names = result.current.visibleNodes.map((n) => n.node.name);
      expect(names).toEqual(["car", "make", "motorcycle", "other"]);
    });
  });

  describe("expansion", () => {
    it("toggleExpand opens then closes a branch", () => {
      const { result } = setup();
      act(() => result.current.toggleExpand("vehicle_type/car"));
      expect(result.current.expandedPaths.has("vehicle_type/car")).toBe(true);
      act(() => result.current.toggleExpand("vehicle_type/car"));
      expect(result.current.expandedPaths.has("vehicle_type/car")).toBe(false);
    });

    it("expand is idempotent", () => {
      const { result } = setup();
      act(() => result.current.expand("vehicle_type/car"));
      const before = result.current.expandedPaths;
      act(() => result.current.expand("vehicle_type/car"));
      expect(result.current.expandedPaths).toBe(before);
    });

    it("collapse is idempotent", () => {
      const { result } = setup();
      const before = result.current.expandedPaths;
      act(() => result.current.collapse("vehicle_type/car"));
      expect(result.current.expandedPaths).toBe(before);
    });

    it("resetExpansion clears all expanded paths", () => {
      const { result } = setup();
      act(() => {
        result.current.expand("vehicle_type/car");
        result.current.expand("vehicle_type/other");
      });
      expect(result.current.expandedPaths.size).toBe(2);
      act(() => result.current.resetExpansion());
      expect(result.current.expandedPaths.size).toBe(0);
    });
  });

  describe("isOpen", () => {
    it("returns true for explicitly expanded paths", () => {
      const { result } = setup();
      act(() => result.current.expand("vehicle_type/car"));
      expect(result.current.isOpen("vehicle_type/car")).toBe(true);
    });

    it("returns true for force-open paths", () => {
      const forceOpenPaths = new Set(["vehicle_type/car"]);
      const { result } = setup({ forceOpenPaths });
      expect(result.current.isOpen("vehicle_type/car")).toBe(true);
    });

    it("returns false for neither expanded nor force-open", () => {
      const { result } = setup();
      expect(result.current.isOpen("vehicle_type/car")).toBe(false);
    });
  });

  describe("activePath and isActive", () => {
    it("defaults to null", () => {
      const { result } = setup();
      expect(result.current.activePath).toBeNull();
    });

    it("setActivePath updates activePath", () => {
      const { result } = setup();
      act(() => result.current.setActivePath("vehicle_type/car"));
      expect(result.current.activePath).toBe("vehicle_type/car");
      expect(result.current.isActive("vehicle_type/car")).toBe(true);
      expect(result.current.isActive("vehicle_type/motorcycle")).toBe(false);
    });
  });

  describe("isSelected", () => {
    it("returns true for a single-element selection", () => {
      const selection = new Set(["vehicle_type/motorcycle"]);
      const { result } = setup({ selection });
      const moto = result.current.visibleNodes.find(
        (n) => n.path === "vehicle_type/motorcycle"
      )!;
      expect(result.current.isSelected(moto)).toBe(true);
    });

    it("returns true for all members of a multi-element selection", () => {
      const selection = new Set([
        "vehicle_type/car",
        "vehicle_type/motorcycle",
      ]);
      const { result } = setup({ selection });
      const car = result.current.visibleNodes.find(
        (n) => n.path === "vehicle_type/car"
      )!;
      const moto = result.current.visibleNodes.find(
        (n) => n.path === "vehicle_type/motorcycle"
      )!;
      expect(result.current.isSelected(car)).toBe(true);
      expect(result.current.isSelected(moto)).toBe(true);
    });

    it("returns false for nodes not in the selection", () => {
      const selection = new Set(["vehicle_type/motorcycle"]);
      const { result } = setup({ selection });
      const car = result.current.visibleNodes.find(
        (n) => n.path === "vehicle_type/car"
      )!;
      expect(result.current.isSelected(car)).toBe(false);
    });

    it("returns false for all nodes when selection is undefined", () => {
      const { result } = setup();
      const car = result.current.visibleNodes[0];
      const moto = result.current.visibleNodes[1];
      expect(result.current.isSelected(car)).toBe(false);
      expect(result.current.isSelected(moto)).toBe(false);
    });
  });

  describe("activeDescendantId", () => {
    it("is undefined when no activePath", () => {
      const { result } = setup();
      expect(result.current.activeDescendantId).toBeUndefined();
    });

    it("encodes slashes to hyphens", () => {
      const { result } = setup({ idPrefix: "test" });
      act(() => result.current.setActivePath("vehicle_type/car"));
      expect(result.current.activeDescendantId).toBe("test-vehicle_type-car");
    });
  });

  describe("rowId", () => {
    it("encodes path slashes as hyphens", () => {
      const { result } = setup({ idPrefix: "pfx" });
      expect(result.current.rowId("vehicle_type/car/make")).toBe(
        "pfx-vehicle_type-car-make"
      );
    });
  });

  describe("getItemProps", () => {
    it("returns correct role and tabIndex", () => {
      const { result } = setup();
      const node = result.current.visibleNodes[0];
      const props = result.current.getItemProps(node);
      expect(props.role).toBe("treeitem");
      expect(props.tabIndex).toBe(-1);
    });

    it("sets aria-selected for selectable nodes in selection", () => {
      const selection = new Set(["vehicle_type/car"]);
      const { result } = setup({ selection });
      const car = result.current.visibleNodes[0];
      const props = result.current.getItemProps(car);
      expect(props["aria-selected"]).toBe(true);
    });

    it("sets aria-selected true for multiple selected nodes", () => {
      const selection = new Set([
        "vehicle_type/car",
        "vehicle_type/motorcycle",
      ]);
      const { result } = setup({ selection });
      const car = result.current.visibleNodes[0];
      const moto = result.current.visibleNodes[1];
      expect(result.current.getItemProps(car)["aria-selected"]).toBe(true);
      expect(result.current.getItemProps(moto)["aria-selected"]).toBe(true);
    });

    it("sets aria-selected undefined for non-selectable nodes", () => {
      const { result } = setup();
      act(() => result.current.expand("vehicle_type/car"));
      const make = result.current.visibleNodes.find(
        (n) => n.path === "vehicle_type/car/make"
      )!;
      const props = result.current.getItemProps(make);
      expect(props["aria-selected"]).toBeUndefined();
    });

    it("sets aria-expanded for branches", () => {
      const { result } = setup();
      const car = result.current.visibleNodes[0];
      const props = result.current.getItemProps(car);
      expect(props["aria-expanded"]).toBe(false);
    });

    it("sets aria-expanded undefined for leaves", () => {
      const { result } = setup();
      const moto = result.current.visibleNodes[1];
      const props = result.current.getItemProps(moto);
      expect(props["aria-expanded"]).toBeUndefined();
    });

    it("sets data-active for the active node", () => {
      const { result } = setup();
      act(() => result.current.setActivePath("vehicle_type/car"));
      const car = result.current.visibleNodes[0];
      const props = result.current.getItemProps(car);
      expect(props["data-active"]).toBe(true);
    });

    it("sets data-active undefined for inactive nodes", () => {
      const { result } = setup();
      const car = result.current.visibleNodes[0];
      const props = result.current.getItemProps(car);
      expect(props["data-active"]).toBeUndefined();
    });

    it("onClick fires onSelect for selectable nodes", () => {
      const onSelect = jest.fn();
      const { result } = setup({ onSelect });
      const car = result.current.visibleNodes[0];
      const props = result.current.getItemProps(car);
      act(() => props.onClick());
      expect(onSelect).toHaveBeenCalledWith("vehicle_type/car");
    });

    it("onClick toggles expansion for non-selectable branches", () => {
      const { result } = setup();
      act(() => result.current.expand("vehicle_type/car"));
      const make = result.current.visibleNodes.find(
        (n) => n.path === "vehicle_type/car/make"
      )!;
      const props = result.current.getItemProps(make);
      act(() => props.onClick());
      expect(result.current.expandedPaths.has("vehicle_type/car/make")).toBe(
        true
      );
    });

    it("onMouseEnter sets activePath", () => {
      const { result } = setup();
      const moto = result.current.visibleNodes[1];
      const props = result.current.getItemProps(moto);
      act(() => props.onMouseEnter());
      expect(result.current.activePath).toBe("vehicle_type/motorcycle");
    });
  });

  describe("getChevronProps", () => {
    it("returns correct aria-label for collapsed", () => {
      const { result } = setup();
      const car = result.current.visibleNodes[0];
      const props = result.current.getChevronProps(car);
      expect(props["aria-label"]).toBe("Expand car");
      expect(props["aria-expanded"]).toBe(false);
    });

    it("returns correct aria-label for expanded", () => {
      const { result } = setup();
      act(() => result.current.expand("vehicle_type/car"));
      const car = result.current.visibleNodes[0];
      const props = result.current.getChevronProps(car);
      expect(props["aria-label"]).toBe("Collapse car");
      expect(props["aria-expanded"]).toBe(true);
    });

    it("onClick toggles expansion and stops propagation", () => {
      const { result } = setup();
      const car = result.current.visibleNodes[0];
      const props = result.current.getChevronProps(car);
      const fakeEvent = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      };
      act(() => props.onClick(fakeEvent));
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.expandedPaths.has("vehicle_type/car")).toBe(true);
    });
  });

  describe("defaultExpanded", () => {
    it("seeds expandedPaths from a Set", () => {
      const defaults = new Set(["vehicle_type/car"]);
      const { result } = setup({ defaultExpanded: defaults });
      expect(result.current.expandedPaths.has("vehicle_type/car")).toBe(true);
      const names = result.current.visibleNodes.map((n) => n.node.name);
      expect(names).toContain("make");
    });

    it("expands all branches when true", () => {
      const { result } = setup({ defaultExpanded: true });
      expect(result.current.expandedPaths.has("vehicle_type/car")).toBe(true);
      expect(result.current.expandedPaths.has("vehicle_type/car/make")).toBe(
        true
      );
      expect(result.current.expandedPaths.has("vehicle_type/other")).toBe(true);
      const names = result.current.visibleNodes.map((n) => n.node.name);
      expect(names).toContain("Honda");
      expect(names).toContain("Toyota");
      expect(names).toContain("golf_cart");
    });

    it("expands nothing when false", () => {
      const { result } = setup({ defaultExpanded: false });
      expect(result.current.expandedPaths.size).toBe(0);
    });

    it("allows collapsing a default-expanded path", () => {
      const defaults = new Set(["vehicle_type/car"]);
      const { result } = setup({ defaultExpanded: defaults });
      expect(result.current.isOpen("vehicle_type/car")).toBe(true);
      act(() => result.current.collapse("vehicle_type/car"));
      expect(result.current.isOpen("vehicle_type/car")).toBe(false);
    });

    it("resetExpansion restores default-expanded paths", () => {
      const defaults = new Set(["vehicle_type/car"]);
      const { result } = setup({ defaultExpanded: defaults });
      act(() => {
        result.current.collapse("vehicle_type/car");
        result.current.expand("vehicle_type/other");
      });
      expect(result.current.expandedPaths.has("vehicle_type/car")).toBe(false);
      expect(result.current.expandedPaths.has("vehicle_type/other")).toBe(true);
      act(() => result.current.resetExpansion());
      expect(result.current.expandedPaths.has("vehicle_type/car")).toBe(true);
      expect(result.current.expandedPaths.has("vehicle_type/other")).toBe(
        false
      );
    });

    it("resetExpansion clears to empty when no defaultExpanded", () => {
      const { result } = setup();
      act(() => result.current.expand("vehicle_type/car"));
      act(() => result.current.resetExpansion());
      expect(result.current.expandedPaths.size).toBe(0);
    });
  });

  describe("keyboard navigation", () => {
    it("ArrowDown moves to the next visible node", () => {
      const { result } = setup();
      act(() => result.current.setActivePath("vehicle_type/car"));
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowDown")));
      expect(result.current.activePath).toBe("vehicle_type/motorcycle");
    });

    it("ArrowDown from -1 activates the first node", () => {
      const { result } = setup();
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowDown")));
      expect(result.current.activePath).toBe("vehicle_type/car");
    });

    it("ArrowDown at the end is a no-op", () => {
      const { result } = setup();
      act(() => result.current.setActivePath("vehicle_type/other"));
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowDown")));
      expect(result.current.activePath).toBe("vehicle_type/other");
    });

    it("ArrowUp moves to the previous visible node", () => {
      const { result } = setup();
      act(() => result.current.setActivePath("vehicle_type/motorcycle"));
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowUp")));
      expect(result.current.activePath).toBe("vehicle_type/car");
    });

    it("ArrowUp at the start is a no-op", () => {
      const { result } = setup();
      act(() => result.current.setActivePath("vehicle_type/car"));
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowUp")));
      expect(result.current.activePath).toBe("vehicle_type/car");
    });

    it("ArrowRight expands a collapsed branch", () => {
      const { result } = setup();
      act(() => result.current.setActivePath("vehicle_type/car"));
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowRight")));
      expect(result.current.isOpen("vehicle_type/car")).toBe(true);
    });

    it("ArrowRight on an expanded branch moves to first child", () => {
      const { result } = setup();
      act(() => {
        result.current.setActivePath("vehicle_type/car");
        result.current.expand("vehicle_type/car");
      });
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowRight")));
      expect(result.current.activePath).toBe("vehicle_type/car/make");
    });

    it("ArrowRight on a leaf is a no-op", () => {
      const { result } = setup();
      act(() => result.current.setActivePath("vehicle_type/motorcycle"));
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowRight")));
      expect(result.current.activePath).toBe("vehicle_type/motorcycle");
    });

    it("ArrowLeft collapses an expanded branch", () => {
      const { result } = setup();
      act(() => {
        result.current.setActivePath("vehicle_type/car");
        result.current.expand("vehicle_type/car");
      });
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowLeft")));
      expect(result.current.isOpen("vehicle_type/car")).toBe(false);
    });

    it("ArrowLeft on a collapsed node moves to parent", () => {
      const { result } = setup();
      act(() => {
        result.current.expand("vehicle_type/car");
        result.current.setActivePath("vehicle_type/car/make");
      });
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowLeft")));
      expect(result.current.activePath).toBe("vehicle_type/car");
    });

    it("Enter fires onSelect for a selectable node", () => {
      const onSelect = jest.fn();
      const { result } = setup({ onSelect });
      act(() => result.current.setActivePath("vehicle_type/car"));
      act(() => result.current.handleKeyDown(fakeKeyEvent("Enter")));
      expect(onSelect).toHaveBeenCalledWith("vehicle_type/car");
    });

    it("Enter does not fire onSelect for non-selectable nodes", () => {
      const onSelect = jest.fn();
      const { result } = setup({ onSelect });
      act(() => {
        result.current.expand("vehicle_type/car");
        result.current.setActivePath("vehicle_type/car/make");
      });
      act(() => result.current.handleKeyDown(fakeKeyEvent("Enter")));
      expect(onSelect).not.toHaveBeenCalled();
    });

    it("Escape fires onEscape", () => {
      const onEscape = jest.fn();
      const { result } = setup({ onEscape });
      act(() => result.current.handleKeyDown(fakeKeyEvent("Escape")));
      expect(onEscape).toHaveBeenCalled();
    });

    it("navigates through expanded children in order", () => {
      const { result } = setup();
      act(() => {
        result.current.expand("vehicle_type/car");
        result.current.setActivePath("vehicle_type/car");
      });
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowDown")));
      expect(result.current.activePath).toBe("vehicle_type/car/make");
      act(() => result.current.handleKeyDown(fakeKeyEvent("ArrowDown")));
      expect(result.current.activePath).toBe("vehicle_type/motorcycle");
    });
  });

  describe("hasSelectedDescendant", () => {
    it("returns true for every ancestor of a selected path", () => {
      const selection = new Set([
        "vehicle_type/car/make/Honda/model/Civic",
      ]);
      const { result } = setup({ selection });
      const find = (p: string) =>
        result.current.visibleNodes.find((n) => n.path === p);

      expect(
        result.current.hasSelectedDescendant(find("vehicle_type/car")!)
      ).toBe(true);
    });

    it("returns true for intermediate ancestors", () => {
      const selection = new Set([
        "vehicle_type/car/make/Honda/model/Civic",
      ]);
      const { result } = setup({
        selection,
        defaultExpanded: true,
      });
      const find = (p: string) =>
        result.current.visibleNodes.find((n) => n.path === p);

      expect(
        result.current.hasSelectedDescendant(find("vehicle_type/car/make")!)
      ).toBe(true);
      expect(
        result.current.hasSelectedDescendant(
          find("vehicle_type/car/make/Honda")!
        )
      ).toBe(true);
      expect(
        result.current.hasSelectedDescendant(
          find("vehicle_type/car/make/Honda/model")!
        )
      ).toBe(true);
    });

    it("returns false for the selected node itself", () => {
      const selection = new Set(["vehicle_type/motorcycle"]);
      const { result } = setup({ selection });
      const moto = result.current.visibleNodes.find(
        (n) => n.path === "vehicle_type/motorcycle"
      )!;
      expect(result.current.hasSelectedDescendant(moto)).toBe(false);
    });

    it("returns false for siblings of ancestors", () => {
      const selection = new Set([
        "vehicle_type/car/make/Honda/model/Civic",
      ]);
      const { result } = setup({ selection });
      const moto = result.current.visibleNodes.find(
        (n) => n.path === "vehicle_type/motorcycle"
      )!;
      const other = result.current.visibleNodes.find(
        (n) => n.path === "vehicle_type/other"
      )!;
      expect(result.current.hasSelectedDescendant(moto)).toBe(false);
      expect(result.current.hasSelectedDescendant(other)).toBe(false);
    });

    it("returns false for all nodes when selection is undefined", () => {
      const { result } = setup();
      for (const node of result.current.visibleNodes) {
        expect(result.current.hasSelectedDescendant(node)).toBe(false);
      }
    });

    it("returns false for all nodes when selection is empty", () => {
      const { result } = setup({ selection: new Set() });
      for (const node of result.current.visibleNodes) {
        expect(result.current.hasSelectedDescendant(node)).toBe(false);
      }
    });
  });
});
