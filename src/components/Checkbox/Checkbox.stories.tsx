import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Checkbox, Radius, Size } from "@voxel51/voodo";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: Object.values(Size),
      description: "The size of the checkbox",
    },
    radius: {
      control: "select",
      options: Object.values(Radius),
      description: "The border radius of the checkbox",
    },
    label: {
      control: "text",
      description: "The label text for the checkbox",
    },
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
  },
};

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={setChecked}
        label={args.label || "Checkbox label"}
        size={args.size || Size.Md}
        radius={args.radius || Radius.Sm}
      />
    );
  },
};

export const Checked: Story = {
  args: {
    label: "Checked checkbox",
    checked: true,
    size: Size.Md,
    radius: Radius.Sm,
  },
};

export const Unchecked: Story = {
  args: {
    label: "Unchecked checkbox",
    checked: false,
    size: Size.Md,
    radius: Radius.Sm,
  },
};
export const Unset: Story = {
  args: {
    label: "Unset checkbox",
    checked: undefined,
    size: Size.Md,
    radius: Radius.Sm,
    showUnsetHint: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled checkbox",
    disabled: true,
    size: Size.Md,
    radius: Radius.Sm,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Disabled checked checkbox",
    checked: true,
    disabled: true,
    size: Size.Md,
    radius: Radius.Sm,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox checked label="Small" size={Size.Sm} />
      <Checkbox checked label="Medium" size={Size.Md} />
      <Checkbox checked label="Large" size={Size.Lg} />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: {
    size: Size.Md,
    radius: Radius.Sm,
  },
};

export default meta;
