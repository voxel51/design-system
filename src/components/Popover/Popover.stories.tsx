import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Button,
  DropdownTrigger,
  Input,
  InputType,
  Orientation,
  Popover,
  PopoverAnchor,
  type PopoverProps,
  type PopoverRenderProps,
  Spacing,
  Stack,
  Text,
  TextVariant,
  ZIndex,
} from "@voxel51/voodo";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    anchor: {
      control: "select",
      options: Object.values(PopoverAnchor),
      description: "Position of the panel relative to the trigger",
    },
    portal: {
      control: "boolean",
      description: "Render the panel in a portal",
    },
    disabled: {
      control: "boolean",
      description: "Whether the trigger can open the panel",
    },
    zIndex: {
      control: "select",
      options: Object.values(ZIndex),
      description: "Stacking tier for a panel that is not portaled",
    },
    focusOnOpen: {
      control: "boolean",
      description: "Move focus into the panel when it opens",
    },
  },
};

type Story = StoryObj<typeof Popover>;

const settings = (
  <Stack orientation={Orientation.Column} spacing={Spacing.Sm}>
    <Text variant={TextVariant.Label}>Similarity index</Text>
    <Input defaultValue="clip-vit-base32" />
    <Text variant={TextVariant.Label}>Matches</Text>
    <Input type={InputType.Number} defaultValue="25" />
  </Stack>
);

const defaultArgs: Partial<PopoverProps> = {
  trigger: <DropdownTrigger>Search settings</DropdownTrigger>,
  children: settings,
  panelClassName: "w-[280px]",
};

export const Default: Story = {
  args: defaultArgs,
};

export const ClosedFromContent: Story = {
  args: {
    trigger: <DropdownTrigger>Edit</DropdownTrigger>,
    panelClassName: "w-[280px]",
    children: ({ close }: PopoverRenderProps) => (
      <Stack orientation={Orientation.Column} spacing={Spacing.Sm}>
        {settings}
        <Button onClick={close}>Done</Button>
      </Stack>
    ),
  },
};

export const Above: Story = {
  args: {
    ...defaultArgs,
    anchor: PopoverAnchor.TopStart,
  },
};

/** Something other than the trigger decides: here, a button beside it. */
const ControlledExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <Stack orientation={Orientation.Row} spacing={Spacing.Md}>
      <Button onClick={() => setOpen(true)}>Open the editor</Button>
      <Popover
        trigger={<Text>Anchored here</Text>}
        open={open}
        onOpenChange={setOpen}
        panelClassName="w-[280px]"
      >
        {settings}
      </Popover>
    </Stack>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    disabled: true,
  },
};

export default meta;
