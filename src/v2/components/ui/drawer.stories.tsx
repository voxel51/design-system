import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@voxel51/voodo/v2";

/**
 * Bottom drawer with drag-to-dismiss, built on Vaul. Distinct from `Sheet`:
 * this one is gesture-driven and suits touch. On desktop prefer `Sheet`.
 */
const meta: Meta<typeof Drawer> = {
  title: "v2/Components/Drawer",
  component: Drawer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Drag down or press Escape to dismiss.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Apply</Button>
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
