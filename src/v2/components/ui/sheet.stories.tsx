import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@voxel51/voodo/v2";

/**
 * Panel that slides in from an edge. Same primitive as `Dialog` — focus trap,
 * Escape, overlay dismiss — laid out against a side.
 *
 * `side` accepts `right` (default), `left`, `top`, `bottom`. Use it for
 * editing alongside context; use `Dialog` when the task is self-contained.
 */
const meta: Meta<typeof Sheet> = {
  title: "v2/Components/Sheet",
  component: Sheet,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open settings</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Service settings</SheetTitle>
          <SheetDescription>Applies on next restart.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sheet-endpoint">Endpoint</Label>
            <Input id="sheet-endpoint" defaultValue="https://argo.internal:2746" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Cancel</Button>
          </SheetClose>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="secondary" size="sm">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>side=&quot;{side}&quot;</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
