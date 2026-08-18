import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@voxel51/voodo/v2";

/**
 * Non-modal floating panel anchored to a trigger. Interactive content is
 * fine here — unlike `Tooltip`, which is hover-only and must stay
 * non-interactive.
 *
 * Positioning, collision flipping and dismissal come from Radix Popover.
 */
const meta: Meta<typeof Popover> = {
  title: "v2/Components/Popover",
  component: Popover,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Set limits</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="flex flex-col gap-3">
          <p className="text-subheading font-medium">Resource limits</p>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cpu">CPU</Label>
            <Input id="cpu" defaultValue="4" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex gap-2">
      {(["start", "center", "end"] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm">{align}</Button>
          </PopoverTrigger>
          <PopoverContent align={align} className="w-48 text-body-sm">
            align=&quot;{align}&quot;
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};
