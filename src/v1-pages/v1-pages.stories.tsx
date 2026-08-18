import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatasetsPageV1 } from "./DatasetsPageV1";
import { SettingsActivityPageV1 } from "./SettingsActivityPageV1";
import { SettingsServicesPageV1 } from "./SettingsServicesPageV1";

/**
 * The same three pages, built with voodo 1.0.
 *
 * Same design, same data as `v2/Pages`, so a side-by-side shows the design
 * system rather than the content. Everything voodo 1.0 provides is used —
 * Button, Input, Text, Icon, Stack, Table, Pill — and everything it does not
 * is in `handRolled.tsx`, which is the point of the exercise.
 *
 * Ten components had to be written to make these three pages exist: a modal,
 * a switch, a progress bar, a chart, an avatar, tabs, a status chip, an icon
 * button, the app shell and header, and the settings page/section frames.
 * All ten ship in v2.
 *
 * Two are not styling gaps but behavior gaps, and they are the ones that
 * matter:
 *
 * - The row menu is a native `<details>`, because voodo's `Dropdown` requires
 *   its own trigger button. It has no keyboard navigation, no typeahead and
 *   no focus return.
 * - The modal has no focus trap, no scroll lock and no `aria-modal` wiring.
 *
 * In v2 both come from radix and are correct without anyone thinking about
 * it. That is the difference between a component library and a set of
 * styled primitives.
 */
const meta: Meta = {
  title: "v1/Pages",
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

/** Compare with `v2/Pages/Settings Services`. */
export const SettingsServices: Story = {
  render: () => (
    <div className="h-screen">
      <SettingsServicesPageV1 />
    </div>
  ),
};

/** Compare with `v2/Pages/Settings Activity`. */
export const SettingsActivity: Story = {
  render: () => (
    <div className="h-screen">
      <SettingsActivityPageV1 />
    </div>
  ),
};

/** Compare with `v2/Pages/Datasets`. */
export const Datasets: Story = {
  render: () => (
    <div className="h-screen">
      <DatasetsPageV1 />
    </div>
  ),
};
