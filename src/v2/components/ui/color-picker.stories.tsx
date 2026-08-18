import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { ColorPicker, type ColorOption } from "@voxel51/voodo/v2";

/**
 * Swatch picker over a fixed option list. Options carry an `id` and an HSL
 * triple without the `hsl()` wrapper — the same format the theme tokens use,
 * so a palette slot can be passed straight through.
 *
 * A closed set by design: arbitrary hues do not belong in the product.
 */
const meta: Meta<typeof ColorPicker> = {
  title: "v2/Components/ColorPicker",
  component: ColorPicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { size: { control: "select", options: ["sm", "md"] } },
};
export default meta;

type Story = StoryObj<typeof ColorPicker>;

const OPTIONS: ColorOption[] = [
  { id: "violet", hsl: "265 80% 65%" },
  { id: "indigo", hsl: "230 75% 62%" },
  { id: "cyan", hsl: "190 85% 55%" },
  { id: "teal", hsl: "172 70% 45%" },
  { id: "emerald", hsl: "150 60% 50%" },
  { id: "amber", hsl: "38 92% 55%" },
  { id: "rose", hsl: "340 82% 60%" },
  { id: "slate", hsl: "220 15% 55%" },
];

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = React.useState("indigo");
    return <ColorPicker value={value} onChange={setValue} options={OPTIONS} />;
  },
};

export const Small: Story = {
  render: function SmallStory() {
    const [value, setValue] = React.useState("teal");
    return <ColorPicker value={value} onChange={setValue} options={OPTIONS} size="sm" />;
  },
};
