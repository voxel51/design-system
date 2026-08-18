import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  TextAction,
} from "@voxel51/voodo/v2";

/**
 * One section that opens and closes. `Accordion` is the multi-section
 * component built on this; reach for Collapsible when there is exactly one
 * region and you want to supply the trigger.
 */
const meta: Meta<typeof Collapsible> = {
  title: "v2/Components/Collapsible",
  component: Collapsible,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-80">
      <CollapsibleTrigger asChild>
        <TextAction>
          <ChevronDown className="h-3.5 w-3.5" /> 3 instances
        </TextAction>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <ul className="flex flex-col gap-1 text-body-sm text-secondary-foreground">
          <li>ritchie@voxel51.com</li>
          <li>sejal@voxel51.com</li>
          <li>tim@voxel51.com</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  ),
};
