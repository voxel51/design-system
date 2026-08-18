import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@voxel51/voodo/v2";

/**
 * Single-choice dropdown on Radix Select. Typeahead, keyboard navigation and
 * focus return are handled by the primitive.
 *
 * The trigger renders `SelectValue`, which falls back to `placeholder` while
 * unset. Items may be grouped with `SelectGroup` + `SelectLabel`.
 */
const meta: Meta<typeof Select> = {
  title: "v2/Components/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a kind" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="orchestrator">Orchestrator</SelectItem>
        <SelectItem value="scheduler">Scheduler</SelectItem>
        <SelectItem value="vector-index">Vector index</SelectItem>
        <SelectItem value="compute-pool">Compute pool</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Select defaultValue="current-view">
      <SelectTrigger className="w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="current-view">Current view</SelectItem>
        <SelectItem value="entire">Entire dataset</SelectItem>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Saved views</SelectLabel>
          <SelectItem value="view:train">train-split</SelectItem>
          <SelectItem value="view:hard">hard-negatives</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="scope">Scope</Label>
      <Select defaultValue="global">
        <SelectTrigger id="scope">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="global">Global</SelectItem>
          <SelectItem value="per-user">Per-user</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Managed by the platform" />
      </SelectTrigger>
      <SelectContent />
    </Select>
  ),
};
