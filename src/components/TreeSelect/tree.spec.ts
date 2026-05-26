import {
  buildResolvedTree,
  collectBranchPaths,
  filterTreeForQuery,
  flattenVisible,
  formatBreadcrumb,
  getNodeByPath,
  getParentPath,
  isSelectable,
  splitPath,
} from "./tree";
import type { TreeNode } from "./types";

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
                  values: [{ name: "Camry" }, { name: "Corolla" }],
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

describe("isSelectable", () => {
  it("returns true by default (can_select omitted)", () => {
    expect(isSelectable({ name: "Civic" })).toBe(true);
  });

  it("returns true when can_select is explicitly true", () => {
    expect(isSelectable({ name: "x", can_select: true })).toBe(true);
  });

  it("returns false when can_select is false", () => {
    expect(isSelectable({ name: "make", can_select: false })).toBe(false);
  });

  it("returns false for branch nodes when leavesOnly is true", () => {
    const branch: TreeNode = { name: "car", values: [{ name: "Civic" }] };
    expect(isSelectable(branch, true)).toBe(false);
  });

  it("returns true for leaf nodes when leavesOnly is true", () => {
    expect(isSelectable({ name: "Civic" }, true)).toBe(true);
  });

  it("returns false when can_select is false even with leavesOnly false", () => {
    const node: TreeNode = {
      name: "make",
      can_select: false,
      values: [{ name: "Honda" }],
    };
    expect(isSelectable(node, false)).toBe(false);
  });
});

describe("buildResolvedTree", () => {
  it("returns a resolved root with correct path and depth", () => {
    const resolved = buildResolvedTree(vehicleTree);
    expect(resolved.path).toBe("vehicle_type");
    expect(resolved.depth).toBe(0);
    expect(resolved.isLeaf).toBe(false);
  });

  it("sets posinset and setsize on root children", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const [car, motorcycle, other] = resolved.children;
    // 3 root children
    expect(car.posinset).toBe(1);
    expect(car.setsize).toBe(3);
    expect(motorcycle.posinset).toBe(2);
    expect(motorcycle.setsize).toBe(3);
    expect(other.posinset).toBe(3);
    expect(other.setsize).toBe(3);
  });

  it("sets posinset and setsize on nested children", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const make = resolved.children[0].children[0]; // car > make (only child)
    expect(make.posinset).toBe(1);
    expect(make.setsize).toBe(1);

    const honda = make.children[0];
    const toyota = make.children[1];
    // 2 children under make
    expect(honda.posinset).toBe(1);
    expect(honda.setsize).toBe(2);
    expect(toyota.posinset).toBe(2);
    expect(toyota.setsize).toBe(2);
  });

  it("sets posinset 1 and setsize 1 for the root itself", () => {
    const resolved = buildResolvedTree(vehicleTree);
    expect(resolved.posinset).toBe(1);
    expect(resolved.setsize).toBe(1);
  });

  it("sets correct paths for deeply nested nodes", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const car = resolved.children[0];
    const make = car.children[0];
    const honda = make.children[0];
    const model = honda.children[0];
    const civic = model.children[0];

    expect(car.path).toBe("vehicle_type/car");
    expect(make.path).toBe("vehicle_type/car/make");
    expect(honda.path).toBe("vehicle_type/car/make/Honda");
    expect(model.path).toBe("vehicle_type/car/make/Honda/model");
    expect(civic.path).toBe("vehicle_type/car/make/Honda/model/Civic");
  });

  it("increments depth for each level", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const car = resolved.children[0];
    const make = car.children[0];
    const honda = make.children[0];

    expect(resolved.depth).toBe(0);
    expect(car.depth).toBe(1);
    expect(make.depth).toBe(2);
    expect(honda.depth).toBe(3);
  });

  it("marks nodes with can_select: false as non-selectable", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const make = resolved.children[0].children[0];
    expect(make.selectable).toBe(false);
    expect(make.node.can_select).toBe(false);
  });

  it("marks branch nodes selectable by default", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const car = resolved.children[0];
    expect(car.selectable).toBe(true);
    expect(car.isLeaf).toBe(false);
  });

  it("marks branch nodes non-selectable when leavesOnly is true", () => {
    const resolved = buildResolvedTree(vehicleTree, { leavesOnly: true });
    const car = resolved.children[0];
    expect(car.selectable).toBe(false);
  });

  it("marks leaves selectable even with leavesOnly", () => {
    const resolved = buildResolvedTree(vehicleTree, { leavesOnly: true });
    const civic =
      resolved.children[0].children[0].children[0].children[0].children[0];
    expect(civic.node.name).toBe("Civic");
    expect(civic.selectable).toBe(true);
    expect(civic.isLeaf).toBe(true);
  });

  it("identifies leaf nodes correctly", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const motorcycle = resolved.children[1];
    expect(motorcycle.isLeaf).toBe(true);
    expect(motorcycle.children).toEqual([]);
  });

  it("treats an empty values array as an unloaded branch, not a leaf", () => {
    const tree: TreeNode = { name: "root", values: [] };
    const resolved = buildResolvedTree(tree);
    expect(resolved.isLeaf).toBe(false);
    expect(resolved.children).toEqual([]);
  });

  it("treats missing values key as a leaf", () => {
    const tree: TreeNode = { name: "root" };
    const resolved = buildResolvedTree(tree);
    expect(resolved.isLeaf).toBe(true);
    expect(resolved.children).toEqual([]);
  });

  it("marks values: [] as isLazyBranch when no cache exists", () => {
    const tree: TreeNode = { name: "root", values: [] };
    const resolved = buildResolvedTree(tree);
    expect(resolved.isLazyBranch).toBe(true);
  });

  it("marks values: undefined (leaf) as isLazyBranch false", () => {
    const tree: TreeNode = { name: "root" };
    const resolved = buildResolvedTree(tree);
    expect(resolved.isLazyBranch).toBe(false);
  });

  it("marks non-empty values as isLazyBranch false", () => {
    const resolved = buildResolvedTree(vehicleTree);
    expect(resolved.isLazyBranch).toBe(false);
    expect(resolved.children[0].isLazyBranch).toBe(false);
  });

  it("resolves cached children for a lazy branch", () => {
    const tree: TreeNode = {
      name: "root",
      values: [{ name: "lazy_branch", values: [] }],
    };
    const cache = new Map<string, TreeNode[]>([
      ["root/lazy_branch", [{ name: "child_a" }, { name: "child_b" }]],
    ]);
    const resolved = buildResolvedTree(tree, {}, cache);
    const branch = resolved.children[0];
    expect(branch.isLazyBranch).toBe(false);
    expect(branch.isLeaf).toBe(false);
    expect(branch.children).toHaveLength(2);
    expect(branch.children[0].node.name).toBe("child_a");
    expect(branch.children[1].node.name).toBe("child_b");
  });

  it("ignores cache for nodes with populated values", () => {
    const tree: TreeNode = {
      name: "root",
      values: [{ name: "branch", values: [{ name: "existing" }] }],
    };
    const cache = new Map<string, TreeNode[]>([
      ["root/branch", [{ name: "cached_child" }]],
    ]);
    const resolved = buildResolvedTree(tree, {}, cache);
    const branch = resolved.children[0];
    expect(branch.children).toHaveLength(1);
    expect(branch.children[0].node.name).toBe("existing");
  });
});

describe("filterTreeForQuery", () => {
  it("returns null when nothing matches", () => {
    const resolved = buildResolvedTree(vehicleTree);
    expect(filterTreeForQuery(resolved, "zzz_no_match")).toBeNull();
  });

  it("is case-insensitive", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const result = filterTreeForQuery(resolved, "HONDA");
    expect(result).not.toBeNull();
    const names = collectNames(result!.tree);
    expect(names).toContain("Honda");
  });

  it("matches non-selectable nodes", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const result = filterTreeForQuery(resolved, "make");
    expect(result).not.toBeNull();
    const names = collectNames(result!.tree);
    expect(names).toContain("make");
  });

  it("includes ancestors of a match", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const result = filterTreeForQuery(resolved, "Civic")!;
    const names = collectNames(result.tree);
    expect(names).toContain("car");
    expect(names).toContain("make");
    expect(names).toContain("Honda");
    expect(names).toContain("model");
    expect(names).toContain("Civic");
  });

  it("does not include siblings of a match", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const result = filterTreeForQuery(resolved, "Civic")!;
    const names = collectNames(result.tree);
    expect(names).not.toContain("Accord");
  });

  it("includes the full subtree of a match (collapsed, discoverable)", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const result = filterTreeForQuery(resolved, "Honda")!;
    const names = collectNames(result.tree);
    expect(names).toContain("model");
    expect(names).toContain("Civic");
    expect(names).toContain("Accord");
    expect(result.forceOpenPaths.has("vehicle_type/car/make/Honda")).toBe(
      false
    );
  });

  it("force-expands only ancestors, not matches themselves", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const result = filterTreeForQuery(resolved, "Honda")!;
    expect(result.forceOpenPaths.has("vehicle_type")).toBe(true);
    expect(result.forceOpenPaths.has("vehicle_type/car")).toBe(true);
    expect(result.forceOpenPaths.has("vehicle_type/car/make")).toBe(true);
    expect(result.forceOpenPaths.has("vehicle_type/car/make/Honda")).toBe(
      false
    );
  });

  it("unions results from multiple matches across branches", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const result = filterTreeForQuery(resolved, "model")!;
    const names = collectNames(result.tree);
    expect(names).toContain("Honda");
    expect(names).toContain("Toyota");
  });

  it("excludes branches unrelated to the match", () => {
    const resolved = buildResolvedTree(vehicleTree);
    const result = filterTreeForQuery(resolved, "Civic")!;
    const names = collectNames(result.tree);
    expect(names).not.toContain("motorcycle");
    expect(names).not.toContain("other");
  });

  it("recomputes posinset and setsize after pruning siblings", () => {
    // Query "Civic" keeps only one root child (car). After pruning, car
    // should be posinset=1 setsize=1, not posinset=1 setsize=3.
    const resolved = buildResolvedTree(vehicleTree);
    const result = filterTreeForQuery(resolved, "Civic")!;

    const car = result.tree.children[0];
    expect(car.node.name).toBe("car");
    expect(car.posinset).toBe(1);
    expect(car.setsize).toBe(1);
  });

  it("recomputes posinset for multiple surviving siblings after pruning", () => {
    // Query "model" matches both Honda > model and Toyota > model.
    // Both Honda and Toyota survive under make, so they should be 1/2 and 2/2.
    const resolved = buildResolvedTree(vehicleTree);
    const result = filterTreeForQuery(resolved, "model")!;

    const make = result.tree.children[0].children[0]; // car > make
    expect(make.children).toHaveLength(2);
    expect(make.children[0].posinset).toBe(1);
    expect(make.children[0].setsize).toBe(2);
    expect(make.children[1].posinset).toBe(2);
    expect(make.children[1].setsize).toBe(2);
  });
});

function collectNames(node: ReturnType<typeof buildResolvedTree>): string[] {
  const names: string[] = [node.node.name];
  for (const child of node.children) {
    names.push(...collectNames(child));
  }
  return names;
}

describe("getNodeByPath", () => {
  it("returns the root node for the root path", () => {
    const node = getNodeByPath(vehicleTree, "vehicle_type");
    expect(node).toBe(vehicleTree);
  });

  it("resolves a deeply nested node", () => {
    const node = getNodeByPath(
      vehicleTree,
      "vehicle_type/car/make/Honda/model/Civic"
    );
    expect(node).toBeDefined();
    expect(node!.name).toBe("Civic");
  });

  it("returns undefined for a non-existent path", () => {
    const node = getNodeByPath(vehicleTree, "vehicle_type/truck");
    expect(node).toBeUndefined();
  });

  it("returns undefined when root name doesn't match", () => {
    const node = getNodeByPath(vehicleTree, "wrong_root/car");
    expect(node).toBeUndefined();
  });

  it("returns undefined for an empty path", () => {
    const node = getNodeByPath(vehicleTree, "");
    expect(node).toBeUndefined();
  });

  it("resolves intermediate branch nodes", () => {
    const node = getNodeByPath(vehicleTree, "vehicle_type/car/make");
    expect(node).toBeDefined();
    expect(node!.name).toBe("make");
    expect(node!.can_select).toBe(false);
  });
});

describe("splitPath", () => {
  it("splits a multi-segment path", () => {
    expect(splitPath("vehicle_type/car/make/Honda")).toEqual([
      "vehicle_type",
      "car",
      "make",
      "Honda",
    ]);
  });

  it("returns a single-element array for a root-only path", () => {
    expect(splitPath("vehicle_type")).toEqual(["vehicle_type"]);
  });

  it("returns empty array for empty string", () => {
    expect(splitPath("")).toEqual([]);
  });
});

describe("getParentPath", () => {
  it("returns the parent for a multi-segment path", () => {
    expect(getParentPath("vehicle_type/car/make")).toBe("vehicle_type/car");
  });

  it("returns the root for a two-segment path", () => {
    expect(getParentPath("vehicle_type/car")).toBe("vehicle_type");
  });

  it("returns undefined for a single-segment (root-level) path", () => {
    expect(getParentPath("vehicle_type")).toBeUndefined();
  });
});

describe("flattenVisible", () => {
  const resolved = buildResolvedTree(vehicleTree);

  it("returns only root children when nothing is expanded", () => {
    const flat = flattenVisible(resolved, () => false);
    const names = flat.map((n) => n.node.name);
    expect(names).toEqual(["car", "motorcycle", "other"]);
  });

  it("includes children of expanded branches in DOM order", () => {
    const openPaths = new Set(["vehicle_type/car"]);
    const flat = flattenVisible(resolved, (p) => openPaths.has(p));
    const names = flat.map((n) => n.node.name);
    expect(names).toEqual(["car", "make", "motorcycle", "other"]);
  });

  it("recurses into deeply expanded paths", () => {
    const openPaths = new Set(["vehicle_type/car", "vehicle_type/car/make"]);
    const flat = flattenVisible(resolved, (p) => openPaths.has(p));
    const names = flat.map((n) => n.node.name);
    expect(names).toEqual([
      "car",
      "make",
      "Honda",
      "Toyota",
      "motorcycle",
      "other",
    ]);
  });

  it("does not include the root node itself", () => {
    const flat = flattenVisible(resolved, () => true);
    expect(flat[0].node.name).not.toBe("vehicle_type");
  });
});

describe("formatBreadcrumb", () => {
  it("formats a path with spaced separators", () => {
    expect(formatBreadcrumb("vehicle_type/car/make/Honda")).toBe(
      "vehicle_type / car / make / Honda"
    );
  });

  it("returns the name as-is for a single segment", () => {
    expect(formatBreadcrumb("vehicle_type")).toBe("vehicle_type");
  });

  it("returns empty string for empty path", () => {
    expect(formatBreadcrumb("")).toBe("");
  });
});

describe("collectBranchPaths", () => {
  const resolved = buildResolvedTree(vehicleTree);

  it("collects all non-leaf node paths", () => {
    const paths = collectBranchPaths(resolved);
    expect(paths.has("vehicle_type/car")).toBe(true);
    expect(paths.has("vehicle_type/car/make")).toBe(true);
    expect(paths.has("vehicle_type/car/make/Honda")).toBe(true);
    expect(paths.has("vehicle_type/car/make/Honda/model")).toBe(true);
    expect(paths.has("vehicle_type/car/make/Toyota")).toBe(true);
    expect(paths.has("vehicle_type/car/make/Toyota/model")).toBe(true);
    expect(paths.has("vehicle_type/other")).toBe(true);
  });

  it("excludes leaf nodes", () => {
    const paths = collectBranchPaths(resolved);
    expect(paths.has("vehicle_type/motorcycle")).toBe(false);
    expect(paths.has("vehicle_type/car/make/Honda/model/Civic")).toBe(false);
    expect(paths.has("vehicle_type/other/golf_cart")).toBe(false);
  });

  it("excludes the root node itself", () => {
    const paths = collectBranchPaths(resolved);
    expect(paths.has("vehicle_type")).toBe(false);
  });
});
