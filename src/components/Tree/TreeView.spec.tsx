import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { TreeView } from "./TreeView";
import type { TreeNode } from "./types";

// --- jsdom layout mocks for @tanstack/react-virtual ---

const JSDOM_DEFAULT_RECT: DOMRect = {
  x: 0,
  y: 0,
  width: 320,
  height: 36,
  top: 0,
  right: 320,
  bottom: 36,
  left: 0,
  toJSON() {
    return this;
  },
};

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalGetBCR = Element.prototype.getBoundingClientRect;
const OriginalResizeObserver = globalThis.ResizeObserver;

beforeAll(() => {
  Element.prototype.getBoundingClientRect = function () {
    if (this.className?.includes?.("overflow-auto")) {
      return { ...JSDOM_DEFAULT_RECT, height: 400, bottom: 400 };
    }
    return { ...JSDOM_DEFAULT_RECT };
  };

  globalThis.ResizeObserver = class ResizeObserver {
    private cb: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) {
      this.cb = cb;
    }
    observe(target: Element): void {
      const rect = target.getBoundingClientRect();
      this.cb(
        [
          {
            target,
            contentRect: rect,
            borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
            contentBoxSize: [
              { inlineSize: rect.width, blockSize: rect.height },
            ],
            devicePixelContentBoxSize: [
              { inlineSize: rect.width, blockSize: rect.height },
            ],
          } as ResizeObserverEntry,
        ],
        this
      );
    }
    unobserve(): void {}
    disconnect(): void {}
  };
});

afterAll(() => {
  Element.prototype.getBoundingClientRect = originalGetBCR;
  globalThis.ResizeObserver = OriginalResizeObserver;
});

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
            {
              name: "Toyota",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [{ name: "Camry" }, { name: "Corolla" }],
                },
              ],
            },
          ],
        },
      ],
    },
    { name: "motorcycle" },
    {
      name: "other",
      values: [{ name: "golf_cart" }, { name: "atv" }],
    },
  ],
};

function renderTreeView(overrides: Record<string, unknown> = {}) {
  const defaultProps = {
    root: vehicleTree,
    "data-testid": "tree-view",
    ...overrides,
  };
  return render(
    <TreeView {...(defaultProps as React.ComponentProps<typeof TreeView>)} />
  );
}

describe("TreeView", () => {
  describe("rendering", () => {
    it("renders without a trigger or floating panel", () => {
      renderTreeView();
      expect(screen.getByTestId("tree-view")).toBeInTheDocument();
      expect(screen.getByRole("tree")).toBeInTheDocument();
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("renders root-level children immediately (no open step)", () => {
      renderTreeView();
      expect(screen.getByText("car")).toBeInTheDocument();
      expect(screen.getByText("motorcycle")).toBeInTheDocument();
      expect(screen.getByText("other")).toBeInTheDocument();
    });

    it("renders the search input by default", () => {
      renderTreeView();
      expect(
        screen.getByRole("textbox", { name: "Search tree" })
      ).toBeInTheDocument();
    });
  });

  describe("showSearch", () => {
    it("hides search input when showSearch={false}", () => {
      renderTreeView({ showSearch: false });
      expect(
        screen.queryByRole("textbox", { name: "Search tree" })
      ).not.toBeInTheDocument();
    });

    it("makes the wrapper focusable when showSearch={false}", () => {
      renderTreeView({ showSearch: false });
      const body = screen
        .getByTestId("tree-view")
        .querySelector("[tabindex='0']");
      expect(body).toBeInTheDocument();
    });
  });

  describe("controlled query", () => {
    it("hides built-in search when query prop is provided", () => {
      const onQueryChange = jest.fn();
      renderTreeView({ query: "", onQueryChange });
      expect(
        screen.queryByRole("textbox", { name: "Search tree" })
      ).not.toBeInTheDocument();
    });

    it("filters tree based on controlled query", () => {
      const onQueryChange = jest.fn();
      renderTreeView({ query: "motor", onQueryChange });
      expect(screen.getByText("motorcycle")).toBeInTheDocument();
    });
  });

  describe("maxHeight", () => {
    it("applies maxHeight as inline style", () => {
      renderTreeView({ maxHeight: "400px" });
      const tree = screen.getByRole("tree");
      expect(tree.style.maxHeight).toBe("400px");
    });

    it("defaults maxHeight to 100%", () => {
      renderTreeView();
      const tree = screen.getByRole("tree");
      expect(tree.style.maxHeight).toBe("100%");
    });
  });

  describe("navigate mode (default)", () => {
    it("fires onChange with the path when a leaf is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeView({ onChange });

      await user.click(screen.getByText("motorcycle"));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(["vehicle_type", "motorcycle"]);
    });

    it("toggles branch expansion when a branch is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeView({ onChange });

      await user.click(screen.getByText("other"));
      expect(screen.getByText("golf_cart")).toBeInTheDocument();
      expect(screen.getByText("atv")).toBeInTheDocument();

      await user.click(screen.getByText("other"));
      expect(screen.queryByText("golf_cart")).not.toBeInTheDocument();

      expect(onChange).not.toHaveBeenCalled();
    });

    it("does not render checkboxes", () => {
      renderTreeView();
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });

    it("does not apply selected highlight", async () => {
      const user = userEvent.setup();
      renderTreeView();

      await user.click(screen.getByText("motorcycle"));
      const motorcycleItem = screen
        .getByText("motorcycle")
        .closest("[role='treeitem']");
      expect(motorcycleItem).not.toHaveAttribute("aria-selected", "true");
    });
  });

  describe("single-select mode", () => {
    it("fires onChange with the selected path", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeView({ selectable: true, onChange });

      await user.click(screen.getByText("motorcycle"));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(["vehicle_type", "motorcycle"]);
    });

    it("highlights the selected node", () => {
      renderTreeView({
        selectable: true,
        value: ["vehicle_type", "motorcycle"],
      });

      const motorcycleItem = screen
        .getByText("motorcycle")
        .closest("[role='treeitem']");
      expect(motorcycleItem).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("multi-select mode", () => {
    it("renders checkboxes for selectable nodes", () => {
      renderTreeView({ selectable: true, multiSelect: true });
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it("toggles selection on click", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeView({ selectable: true, multiSelect: true, onChange });

      await user.click(screen.getByText("motorcycle"));
      expect(onChange).toHaveBeenCalledWith([["vehicle_type", "motorcycle"]]);
    });

    it("removes a path on second click", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      renderTreeView({
        selectable: true,
        multiSelect: true,
        value: [["vehicle_type", "motorcycle"]],
        onChange,
      });

      await user.click(screen.getByText("motorcycle"));
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe("expand / collapse", () => {
    it("expands a branch via chevron", async () => {
      const user = userEvent.setup();
      renderTreeView();

      expect(screen.queryByText("golf_cart")).not.toBeInTheDocument();
      await user.click(screen.getByLabelText("Expand other"));
      expect(screen.getByText("golf_cart")).toBeInTheDocument();
    });

    it("collapses a branch via chevron", async () => {
      const user = userEvent.setup();
      renderTreeView();

      await user.click(screen.getByLabelText("Expand other"));
      expect(screen.getByText("golf_cart")).toBeInTheDocument();

      await user.click(screen.getByLabelText("Collapse other"));
      expect(screen.queryByText("golf_cart")).not.toBeInTheDocument();
    });
  });

  describe("defaultExpanded", () => {
    it("expands specified branches on mount", () => {
      renderTreeView({
        defaultExpanded: [["vehicle_type", "other"]],
      });

      expect(screen.getByText("golf_cart")).toBeInTheDocument();
      expect(screen.getByText("atv")).toBeInTheDocument();
    });

    it("expands all branches when defaultExpanded is true", () => {
      renderTreeView({ defaultExpanded: true });

      expect(screen.getByText("car")).toBeInTheDocument();
      expect(screen.getByText("make")).toBeInTheDocument();
      expect(screen.getByText("Honda")).toBeInTheDocument();
      expect(screen.getByText("golf_cart")).toBeInTheDocument();
    });
  });

  describe("keyboard navigation", () => {
    it("supports arrow-down navigation with search visible", () => {
      renderTreeView();

      const searchInput = screen.getByRole("textbox", { name: "Search tree" });
      searchInput.focus();

      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });

      const items = screen.getAllByRole("treeitem");
      const activeItem = items.find(
        (item) => item.getAttribute("data-active") === "true"
      );
      expect(activeItem).toBeTruthy();
    });

    it("supports keyboard navigation when showSearch={false}", () => {
      renderTreeView({ showSearch: false });

      const focusable = screen
        .getByTestId("tree-view")
        .querySelector("[tabindex='0']") as HTMLElement;
      expect(focusable).toBeTruthy();

      focusable.focus();
      fireEvent.keyDown(focusable, { key: "ArrowDown" });

      const items = screen.getAllByRole("treeitem");
      const activeItem = items.find(
        (item) => item.getAttribute("data-active") === "true"
      );
      expect(activeItem).toBeTruthy();
    });
  });

  describe("async loadChildren", () => {
    it("shows spinner while loading, then shows children", async () => {
      const user = userEvent.setup();
      let resolveLoad: (children: TreeNode[]) => void;
      const loadChildren = jest.fn(
        () =>
          new Promise<TreeNode[]>((resolve) => {
            resolveLoad = resolve;
          })
      );

      const lazyTree: TreeNode = {
        name: "root",
        values: [{ name: "lazy_branch", values: [] }],
      };

      render(
        <TreeView
          root={lazyTree}
          loadChildren={loadChildren}
          data-testid="lazy-tree"
        />
      );

      await user.click(screen.getByLabelText("Expand lazy_branch"));
      expect(loadChildren).toHaveBeenCalledTimes(1);
      expect(loadChildren).toHaveBeenCalledWith(["root", "lazy_branch"]);

      // eslint-disable-next-line @typescript-eslint/require-await
      await React.act(async () => {
        resolveLoad!([{ name: "child_a" }, { name: "child_b" }]);
      });

      expect(screen.getByText("child_a")).toBeInTheDocument();
      expect(screen.getByText("child_b")).toBeInTheDocument();
    });
  });
});
