import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

import {
  Button,
  formatBreadcrumb,
  getNodeByPath,
  SelectAnchor,
  Text,
  TextColor,
  TextVariant,
  TreeSelect,
  type TreeNode,
  type TreePath,
  type TreeSelectProps,
} from "@voxel51/voodo";

// ---------------------------------------------------------------------------
// Sample data — vehicles
//
// Structure (6 levels deep):
//   vehicle_type / car / make / {Make} / model / {Model}
//
// Honda is intentionally limited to a single model (Pilot) per spec.
// ---------------------------------------------------------------------------

const vehicleTaxonomy: TreeNode = {
  name: "vehicle_type",
  description: "Top-level vehicle classification",
  values: [
    {
      name: "car",
      description: "Passenger automobile",
      values: [
        {
          name: "make",
          can_select: false,
          values: [
            {
              name: "Chevrolet",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [
                    { name: "Camaro" },
                    { name: "Corvette" },
                    { name: "Silverado" },
                    { name: "Tahoe" },
                    { name: "Traverse" },
                  ],
                },
              ],
            },
            {
              name: "Dodge",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [
                    { name: "Challenger" },
                    { name: "Charger" },
                    { name: "Durango" },
                    { name: "Ram 1500" },
                  ],
                },
              ],
            },
            {
              name: "Ford",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [
                    { name: "Bronco" },
                    { name: "Explorer" },
                    { name: "F-150" },
                    { name: "Mustang" },
                    { name: "Ranger" },
                  ],
                },
              ],
            },
            {
              name: "Honda",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [{ name: "Pilot" }],
                },
              ],
            },
            {
              name: "Equus",
              values: [],
            },
          ],
        },
      ],
    },
    {
      name: "truck",
      values: [
        {
          name: "make",
          can_select: false,
          values: [
            {
              name: "Ford",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [
                    { name: "F-150" },
                    { name: "F-250" },
                    { name: "F-350" },
                  ],
                },
              ],
            },
            {
              name: "Chevrolet",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [
                    { name: "Silverado 1500" },
                    { name: "Silverado 2500" },
                  ],
                },
              ],
            },
            {
              name: "Dodge",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [{ name: "Ram 1500" }, { name: "Ram 2500" }],
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
      values: [
        {
          name: "make",
          can_select: false,
          values: [
            {
              name: "Harley-Davidson",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [
                    { name: "Sportster" },
                    { name: "Street Glide" },
                    { name: "Fat Boy" },
                  ],
                },
              ],
            },
            {
              name: "Honda",
              values: [
                {
                  name: "model",
                  can_select: false,
                  values: [{ name: "CBR600RR" }, { name: "Gold Wing" }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "other",
      description: "Less common vehicle types",
      values: [{ name: "golf_cart" }, { name: "atv" }, { name: "snowmobile" }],
    },
  ],
};

// Same tree but a few nodes marked `deprecated` to showcase the deprecated pill UI.
const deprecatedVehicleTaxonomy: TreeNode = {
  ...vehicleTaxonomy,
  values: vehicleTaxonomy.values!.map((top) => {
    if (top.name === "car") {
      return {
        ...top,
        values: top.values!.map((makeGroup) => ({
          ...makeGroup,
          values: makeGroup.values!.map((make) => {
            if (make.name === "Dodge") {
              return {
                ...make,
                deprecated: true,
                description: "Brand consolidated into Ram Trucks in 2010",
              };
            }
            if (make.name === "Chevrolet") {
              return {
                ...make,
                values: make.values!.map((modelGroup) => ({
                  ...modelGroup,
                  values: modelGroup.values!.map((m) =>
                    m.name === "Camaro"
                      ? {
                          ...m,
                          deprecated: true,
                          description: "Discontinued in 2023",
                        }
                      : m
                  ),
                })),
              };
            }
            return make;
          }),
        })),
      };
    }
    return top;
  }),
};

// Lazy variant — each make node has `values: []` so children are fetched on
// first expand via `loadChildren`.
const lazyVehicleTaxonomy: TreeNode = {
  ...vehicleTaxonomy,
  values: vehicleTaxonomy.values!.map((top) => {
    if (top.name === "car") {
      return {
        ...top,
        values: top.values!.map((makeGroup) => ({
          ...makeGroup,
          values: makeGroup.values!.map((make) => ({ ...make, values: [] })),
        })),
      };
    }
    return top;
  }),
};

// ---------------------------------------------------------------------------
// Helpers — deep tree and stress tree generators
// ---------------------------------------------------------------------------

const DEPTH_NAMES = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
  "Twenty — This Is An Extremely Long Node Name Designed To Test Horizontal Overflow And Verify That The Dropdown Panel Scrolls Correctly When Content Exceeds Its Bounds",
];

function buildDeepTree(maxDepth: number): TreeNode {
  const rec = (d: number): TreeNode => {
    const name = DEPTH_NAMES[d - 1] ?? String(d);
    return d === maxDepth ? { name } : { name, values: [rec(d + 1)] };
  };
  return { name: "root", values: [rec(1)] };
}

const deepTree = buildDeepTree(20);

function buildStressTree(branching = 3, depth = 10): TreeNode {
  const rec = (name: string, d: number): TreeNode =>
    d === depth
      ? { name }
      : {
          name,
          values: Array.from({ length: branching }, (_, i) =>
            rec(`${name}.${i + 1}`, d + 1)
          ),
        };
  return rec("root", 0);
}

// ---------------------------------------------------------------------------
// loadChildren implementations
// ---------------------------------------------------------------------------

async function loadChildrenSuccess(path: TreePath): Promise<TreeNode[]> {
  await new Promise((r) => setTimeout(r, 400));
  return getNodeByPath(vehicleTaxonomy, path)?.values ?? [];
}

async function loadChildrenFlaky(path: TreePath): Promise<TreeNode[]> {
  await new Promise((r) => setTimeout(r, 400));
  if (Math.random() < 0.5) {
    throw new Error(
      "Simulated network error — click the retry icon to try again"
    );
  }
  return getNodeByPath(vehicleTaxonomy, path)?.values ?? [];
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof TreeSelect> = {
  title: "Components/TreeSelect",
  component: TreeSelect,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text shown when no value is selected",
    },
    leavesOnly: {
      control: "boolean",
      description:
        "When true, only leaf nodes (nodes without children) are selectable. Branch nodes still expand/collapse.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the entire component",
    },
    anchor: {
      control: "select",
      options: Object.values(SelectAnchor),
      description: "Position of the dropdown panel relative to the trigger",
    },
    multiSelect: {
      control: "boolean",
      description:
        "When true, multiple nodes can be selected simultaneously. Each selected value renders as a removable pill in the trigger.",
    },
    portal: {
      control: "boolean",
      description:
        "Renders the dropdown panel in a portal so it escapes overflow-hidden ancestors",
    },
    defaultExpanded: {
      control: "boolean",
      description:
        "Branches to expand when the panel first opens. `true` expands all branches; a `TreePath[]` array targets specific paths. User-collapsible.",
    },
    panelMaxHeight: {
      control: "text",
      description:
        'Maximum height of the dropdown panel. Accepts any valid CSS length value (e.g. `"400px"`, `"50vh"`). Defaults to `"18rem"` (~288px).',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "100px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "32rem" }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TreeSelect>;

// ---------------------------------------------------------------------------
// Controlled wrappers
// ---------------------------------------------------------------------------

function ControlledTreeSelect(props: TreeSelectProps) {
  const [value, setValue] = useState<TreePath | undefined>(
    props.multiSelect ? undefined : props.value
  );

  return (
    <div className="flex flex-col gap-4">
      <TreeSelect
        {...props}
        multiSelect={false}
        value={value}
        onChange={(path: TreePath | null) => {
          setValue(path ?? undefined);
        }}
      />
      <Text variant={TextVariant.Caption} color={TextColor.Secondary}>
        Selected path:{" "}
        <span className="font-mono">
          {value ? formatBreadcrumb(value) : <em>none</em>}
        </span>
      </Text>
    </div>
  );
}

function ControlledMultiTreeSelect(props: TreeSelectProps) {
  const [values, setValues] = useState<TreePath[]>(
    props.multiSelect ? [...(props.value ?? [])] : []
  );

  return (
    <div className="flex flex-col gap-4">
      <TreeSelect
        {...props}
        multiSelect
        value={values}
        onChange={(paths: TreePath[]) => {
          setValues(paths);
        }}
      />
      <Text variant={TextVariant.Caption} color={TextColor.Secondary}>
        Selected ({values.length}):{" "}
        <span className="font-mono">
          {values.length ? (
            values.map((v) => formatBreadcrumb(v)).join(", ")
          ) : (
            <em>none</em>
          )}
        </span>
      </Text>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StressTestRender(props: any) {
  const [enabled, setEnabled] = useState(false);
  const root = useMemo(
    () => (enabled ? buildStressTree(10, 4) : null),
    [enabled]
  );

  if (!enabled || !root) {
    return (
      <div className="flex flex-col gap-3 items-start">
        <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
          The large tree (~59,000 nodes) is not loaded yet. Click below to build
          it and mount the TreeSelect. Virtualization keeps scrolling smooth.
        </Text>
        <Button onClick={() => setEnabled(true)}>
          Enable Large Tree (~59,000 nodes)
        </Button>
      </div>
    );
  }

  return <ControlledMultiTreeSelect {...props} root={root} />;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Default single-select mode. Use the controls panel on the right to exercise
 * the full surface API: toggle `leavesOnly`, `disabled`, `portal`,
 * `defaultExpanded`, and change the `anchor` position. The selected path is
 * displayed below the component.
 */
export const Default: Story = {
  render: (args) => <ControlledTreeSelect {...args} />,
  args: {
    root: vehicleTaxonomy,
    placeholder: "Select a vehicle…",
  },
};

const customDisplayValueFn = (path: TreePath, node: TreeNode) => {
  const relevant = path.filter(
    (s) => s !== "vehicle_type" && s !== "make" && s !== "model"
  );
  return relevant.length > 1 ? relevant.join(" — ") : node.name;
};

/**
 * A custom `displayValue` formatter replaces the default full breadcrumb with
 * a human-readable label showing only the make and model separated by a dash.
 * This is useful when the full path is too long for the trigger.
 */
export const CustomDisplayValue: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
          <strong>With custom display value</strong> — strips structural path
          segments (<span className="font-mono">vehicle_type</span>,{" "}
          <span className="font-mono">make</span>,{" "}
          <span className="font-mono">model</span>) and joins the meaningful
          parts with a dash. A selection like{" "}
          <span className="font-mono">
            {`["vehicle_type", "car", "make", "Ford", "model", "Mustang"]`}
          </span>{" "}
          becomes <span className="font-mono">car — Ford — Mustang</span>.
        </Text>
        <ControlledTreeSelect {...args} displayValue={customDisplayValueFn} />
      </div>

      <div className="flex flex-col gap-2">
        <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
          <strong>Default display value</strong> — shows the raw leaf node name
          only (e.g. <span className="font-mono">Mustang</span>).
        </Text>
        <ControlledTreeSelect {...args} displayValue={undefined} />
      </div>
    </div>
  ),
  args: {
    root: vehicleTaxonomy,
    placeholder: "Select a vehicle…",
  },
};

/**
 * Nodes can be flagged `deprecated` to render a "deprecated" pill badge. The
 * Dodge make and the Camaro model are marked deprecated here to demonstrate
 * both branch-level and leaf-level badging.
 */
export const DeprecatedNodes: Story = {
  render: (args) => <ControlledTreeSelect {...args} />,
  args: {
    root: deprecatedVehicleTaxonomy,
    placeholder: "Select a vehicle…",
    defaultExpanded: true,
  },
};

/**
 * Multi-select mode. Clicking any selectable node toggles it in/out of the
 * selection. Each picked value renders as a removable pill in the trigger.
 * The trigger grows vertically when pills wrap to a second line.
 */
export const MultiSelect: Story = {
  render: (args) => <ControlledMultiTreeSelect {...args} />,
  args: {
    root: vehicleTaxonomy,
    placeholder: "Select vehicles…",
  },
};

/**
 * Multi-select with lazy-loaded children. The four make nodes under "car"
 * (`Chevrolet`, `Dodge`, `Ford`, `Honda`) start with `values: []`, marking
 * them as unloaded branches. Expanding one triggers `loadChildren`, which
 * waits 400 ms then returns the real children. Children are cached for the
 * lifetime of the panel; re-expanding a loaded branch does not re-fetch.
 */
export const MultiSelectAsyncLoading: Story = {
  render: (args) => <ControlledMultiTreeSelect {...args} />,
  args: {
    root: lazyVehicleTaxonomy,
    placeholder: "Select vehicles…",
    loadChildren: loadChildrenSuccess,
    displayValue: (path: TreePath) => path.at(-1) ?? "",
  },
};

/**
 * Same as `MultiSelectAsyncLoading` but `loadChildren` fails ~50% of the time
 * (random). A failing load replaces the chevron with a refresh icon. Clicking
 * the refresh icon clears the error state and retries the fetch. This
 * showcases the Phase 4 error/retry UI added to `TreeSelectNode`.
 */
export const AsyncLoadingWithErrors: Story = {
  render: (args) => <ControlledMultiTreeSelect {...args} />,
  args: {
    root: lazyVehicleTaxonomy,
    placeholder: "Select vehicles…",
    loadChildren: loadChildrenFlaky,
    displayValue: (path: TreePath) => path.at(-1) ?? "",
  },
};

// ---------------------------------------------------------------------------
// Special characters in node names — story helpers
// ---------------------------------------------------------------------------

const slashNameTree: TreeNode = {
  name: "music",
  values: [
    {
      name: "rock",
      values: [
        { name: "AC/DC" },
        { name: "Guns N' Roses" },
        { name: "Rage Against the Machine" },
      ],
    },
    {
      name: "hip-hop",
      values: [{ name: "Jay-Z" }, { name: "Kendrick Lamar" }],
    },
    {
      name: "country",
      values: [{ name: "50% Twang" }, { name: "Brooks & Dunn" }],
    },
  ],
};

function SpecialCharactersDemo() {
  const [value, setValue] = useState<TreePath | undefined>(undefined);

  const breadcrumb = value ? formatBreadcrumb(value) : null;

  return (
    <div className="flex flex-col gap-6">
      <TreeSelect
        root={slashNameTree}
        value={value}
        onChange={(path) => setValue(path ?? undefined)}
        placeholder="Select an artist…"
        defaultExpanded
      />

      <div className="flex flex-col gap-3 p-4 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-background-card-2)]">
        <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
          <strong>TreePath (value / onChange argument)</strong>
        </Text>
        <Text variant={TextVariant.Sm} color={TextColor.Primary}>
          <span className="font-mono">
            {value ? (
              `[${value.map((s) => `"${s}"`).join(", ")}]`
            ) : (
              <em className="opacity-50">— select a node —</em>
            )}
          </span>
        </Text>

        <div className="border-t border-[var(--color-border-default)] pt-3 flex flex-col gap-1">
          <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
            <strong>
              <code>formatBreadcrumb(value)</code> — human-readable display
            </strong>
          </Text>
          <Text variant={TextVariant.Sm} color={TextColor.Primary}>
            <span className="font-mono">
              {breadcrumb ?? <em className="opacity-50">—</em>}
            </span>
          </Text>
        </div>

        <div className="border-t border-[var(--color-border-default)] pt-3 flex flex-col gap-1">
          <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
            <strong>Last segment (leaf name)</strong>
          </Text>
          <Text variant={TextVariant.Sm} color={TextColor.Primary}>
            <span className="font-mono">
              {value?.at(-1) ?? <em className="opacity-50">—</em>}
            </span>
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-background-card-2)]">
        <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
          <strong>How paths work</strong>
        </Text>
        <Text variant={TextVariant.Sm} color={TextColor.Primary}>
          Every path in <span className="font-mono">TreeSelect</span> is a{" "}
          <span className="font-mono">TreePath</span> — a{" "}
          <span className="font-mono">readonly string[]</span> of raw node names
          from root to the selected node. Characters like{" "}
          <span className="font-mono">/</span> and{" "}
          <span className="font-mono">%</span> in node names are preserved as-is
          — no encoding required.
        </Text>
        <Text variant={TextVariant.Sm} color={TextColor.Primary}>
          This means you can safely use node names that contain any character.
          For example, selecting <strong>AC/DC</strong> yields{" "}
          <span className="font-mono">{`["music", "rock", "AC/DC"]`}</span> —
          the <span className="font-mono">/</span> in the name is just a regular
          array element, not a path separator.
        </Text>
        <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
          <strong>Utilities</strong>
        </Text>
        <ul className="list-disc list-inside flex flex-col gap-1">
          <li>
            <Text variant={TextVariant.Sm} color={TextColor.Primary}>
              <span className="font-mono">formatBreadcrumb(path)</span> — joins
              segments with <span className="font-mono">{" / "}</span> for
              display (e.g.{" "}
              <span className="font-mono">music / rock / AC/DC</span>).
            </Text>
          </li>
          <li>
            <Text variant={TextVariant.Sm} color={TextColor.Primary}>
              <span className="font-mono">getNodeByPath(root, path)</span> —
              walks the tree and returns the{" "}
              <span className="font-mono">TreeNode</span> at the given path, or{" "}
              <span className="font-mono">undefined</span> if not found.
            </Text>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * ### Special characters in node names
 *
 * `TreeSelect` paths are `TreePath` arrays — each element is a raw node name
 * from root to the selected node. This means characters like `/`, `%`, or any
 * other special character in node names "just work" without any encoding or
 * escaping by the consumer.
 *
 * #### Example
 *
 * ```tsx
 * import { TreeSelect, formatBreadcrumb, type TreePath } from "@voxel51/voodo";
 *
 * function MyComponent() {
 *   const [value, setValue] = useState<TreePath | undefined>();
 *
 *   return (
 *     <TreeSelect
 *       root={myTree}
 *       value={value}
 *       onChange={(path) => setValue(path ?? undefined)}
 *     />
 *   );
 * }
 *
 * // When the user selects "AC/DC" under "rock":
 * // value = ["music", "rock", "AC/DC"]
 * //
 * // formatBreadcrumb(value) → "music / rock / AC/DC"
 * // value.at(-1)            → "AC/DC"
 * ```
 *
 * The interactive panel below shows the `TreePath` array, the formatted
 * breadcrumb, and the leaf name for every selection. Try selecting **AC/DC**,
 * **50% Twang**, or any other artist to see how special characters are
 * preserved in the path array.
 */
export const SpecialCharactersInNames: Story = {
  render: () => <SpecialCharactersDemo />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A single-spine tree 20 levels deep. The root is named "root"; each
 * subsequent child is named after its depth in English: One → Two → … → Twenty.
 * Demonstrates keyboard navigation through a deep hierarchy using
 * ArrowDown/ArrowRight and that depth-based indentation scales correctly all
 * the way to the maximum supported depth.
 */
export const DeeplyNested: Story = {
  render: (args) => <ControlledMultiTreeSelect {...args} />,
  args: {
    root: deepTree,
    placeholder: "Select a depth level…",
    defaultExpanded: true,
  },
};

/**
 * **Virtualization stress test.** The tree is NOT built at module load time to
 * avoid hanging the Storybook canvas. Click "Enable Large Tree" to build a
 * tree with branching factor 3 and depth 10, yielding ~59,000 nodes.
 * Node names are composed hierarchically: root → 1 → 1.1 → 1.1.1 → …
 * Scroll and search remain smooth because `TreeSelectPanel` virtualizes the
 * visible row list with `@tanstack/react-virtual`.
 */
export const StressTest: Story = {
  render: (args) => <StressTestRender {...args} />,
  args: {
    placeholder: "Search or scroll ~59,000 nodes…",
    defaultExpanded: true,
  },
};
