import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Heading,
  HeadingLevel,
  palettePool,
  paletteSlots,
  primitives,
  Text,
} from "@voxel51/voodo";
import React from "react";

type Mode = "dark" | "light";

const MODES: Mode[] = ["dark", "light"];

/**
 * Reverse of the generator's primitive lookup: name the scale step a value
 * came from, so a swatch can say "orange 500" instead of just its hex. Values
 * with no scale entry are the extended palette hues Figma defines directly.
 */
const primitiveName = (hex: string): string | undefined => {
  for (const [scale, steps] of Object.entries(primitives)) {
    for (const [step, value] of Object.entries(steps)) {
      if (value.toUpperCase() === hex.toUpperCase()) return `${scale} ${step}`;
    }
  }
  return undefined;
};

const Swatch = ({
  hex,
  label,
  sublabel,
}: {
  hex: string;
  label: string;
  sublabel?: string;
}) => (
  <div className="flex flex-col gap-1 min-w-0">
    <div
      className="h-14 w-full rounded-sm border-1 border-content-border-subtle"
      style={{ backgroundColor: hex }}
    />
    <Text className="truncate font-medium">{label}</Text>
    <Text className="truncate text-content-text-secondary text-xs/4">
      {hex}
      {sublabel ? ` · ${sublabel}` : ""}
    </Text>
  </div>
);

/** The ordered pool, exactly as colors are handed out. */
const Pool = ({ mode }: { mode: Mode }) => (
  <div className="grid grid-cols-6 gap-3">
    {palettePool[mode].map((hex, index) => (
      <Swatch
        key={paletteSlots[mode][index]}
        hex={hex}
        label={`${index + 1}. ${paletteSlots[mode][index]}`}
        sublabel={primitiveName(hex) ?? "no primitive"}
      />
    ))}
  </div>
);

/** Every slot side by side across modes, for spotting mode drift. */
const SlotTable = () => (
  <table className="w-full text-left">
    <thead>
      <tr>
        {["Slot", "Dark", "Light", "Primitive (dark)"].map((h) => (
          <th key={h} className="py-1 pr-4">
            <Text className="font-medium">{h}</Text>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {paletteSlots.dark.map((slot, index) => {
        const dark = palettePool.dark[index];
        const light = palettePool.light[index];
        return (
          <tr key={slot}>
            <td className="py-1 pr-4">
              <Text>{slot}</Text>
            </td>
            {[dark, light].map((hex, i) => (
              <td key={i} className="py-1 pr-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 shrink-0 rounded-xs border-1 border-content-border-subtle"
                    style={{ backgroundColor: hex }}
                  />
                  <Text>{hex}</Text>
                </div>
              </td>
            ))}
            <td className="py-1 pr-4">
              <Text className="text-content-text-secondary">
                {primitiveName(dark) ?? "—"}
              </Text>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

/** The raw scales the semantic tokens reference. */
const Primitives = () => (
  <>
    {Object.entries(primitives).map(([scale, steps]) => (
      <div key={scale} className="mb-4">
        <Text className="font-medium">{scale}</Text>
        <div className="grid grid-cols-12 gap-2 mt-1">
          {Object.entries(steps).map(([step, hex]) => (
            <Swatch key={step} hex={hex} label={step} />
          ))}
        </div>
      </div>
    ))}
  </>
);

const PaletteDocs = () => (
  <>
    <Heading>Palette</Heading>
    <Text>
      The palette pool is the ordered set of colors handed out when something
      needs a series of distinguishable colors — label coloring, chart series,
      legends. It is generated from Figma&apos;s <code>palette/*</code>{" "}
      variables, and reaches the App as <code>palettePool.dark</code> and Python
      as <code>DEFAULT_APP_COLOR_POOL</code>. Slots are ordered by their numeric
      prefix, not lexicographically, so slot 2 precedes slot 10.
    </Text>

    {MODES.map((mode) => (
      <React.Fragment key={mode}>
        <Heading level={HeadingLevel.H2}>
          {mode === "dark" ? "Pool — dark" : "Pool — light"}
        </Heading>
        <div className={mode === "dark" ? "dark" : undefined}>
          <Pool mode={mode} />
        </div>
      </React.Fragment>
    ))}

    <Heading level={HeadingLevel.H2}>Every slot, both modes</Heading>
    <Text>
      Slots labeled <em>no primitive</em> above are extended hues Figma defines
      directly, with no matching step in a primitive scale — the generator emits
      those as raw hex and reports them.
    </Text>
    <SlotTable />

    <Heading level={HeadingLevel.H2}>Primitive scales</Heading>
    <Text>
      The raw ramps every semantic token references. Not emitted as CSS
      variables — bind to a semantic token instead.
    </Text>
    <Primitives />
  </>
);

const meta: Meta = {
  title: "Design System/Palette",
  component: PaletteDocs,
  parameters: {
    docs: {
      page: () => <PaletteDocs />,
    },
  },
};

type Story = StoryObj<typeof PaletteDocs>;

export const Overview: Story = {};

export default meta;
