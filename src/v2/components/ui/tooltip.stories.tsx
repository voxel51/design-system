import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";

import {
  Button,
  IconAction,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@voxel51/voodo/v2";

/**
 * Hover and focus label. Uses the dedicated `--tooltip-bg` /
 * `--tooltip-text` tokens — never restyle the surface at the call site.
 *
 * Content must be non-interactive: tooltips do not receive focus, so
 * anything clickable inside is unreachable by keyboard. Use `Popover` for
 * that.
 *
 * Every icon-only control needs one. `IconAction` takes a `tooltip` prop that
 * wires this up.
 */
const meta: Meta<typeof Tooltip> = {
  title: "v2/Components/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <TooltipProvider><Story /></TooltipProvider>],
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Restarts the service</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>side=&quot;{side}&quot;</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

/** Preferred form for icon-only actions. */
export const OnIconAction: Story = {
  render: () => (
    <IconAction tooltip="What is this?" aria-label="What is this?">
      <Info />
    </IconAction>
  ),
};
