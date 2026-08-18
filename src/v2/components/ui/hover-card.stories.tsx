import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  TextAction,
} from "@voxel51/voodo/v2";

/**
 * Rich preview on hover. Sits between `Tooltip` (short text, no interaction)
 * and `Popover` (click-opened, fully interactive): it carries layout and
 * detail, opens on hover with a delay, and is safe to move the pointer into.
 *
 * Hover-only, so never put an action here that has no other route.
 */
const meta: Meta<typeof HoverCard> = {
  title: "v2/Components/HoverCard",
  component: HoverCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <TextAction>argo-prod</TextAction>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex flex-col gap-2">
          <p className="text-subheading font-medium">argo-prod</p>
          <p className="text-meta text-secondary-foreground">
            Argo on Kubernetes · v3.5.1
          </p>
          <p className="text-body-sm">
            Runs delegated operations for this workspace.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
