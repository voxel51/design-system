import type { Meta, StoryObj } from "@storybook/react-vite";
import { Size, Toggle } from "@voxel51/voodo";
import React, { useState } from "react";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: [Size.Sm, Size.Md],
      description: "The size of the toggle",
    },
    label: {
      control: "text",
      description: "The label text for the toggle",
    },
    checked: {
      control: "boolean",
      description: "Whether the toggle is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the toggle is disabled",
    },
  },
};

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Toggle
        {...args}
        checked={checked}
        onChange={setChecked}
        label={args.label || "Toggle label"}
        size={args.size || Size.Md}
      />
    );
  },
};

export const Checked: Story = {
  args: {
    label: "Checked toggle",
    checked: true,
    size: Size.Sm,
  },
};

export const Unchecked: Story = {
  args: {
    label: "Unchecked toggle",
    checked: false,
    size: Size.Sm,
  },
};

export const Unset: Story = {
  args: {
    label: "Unset toggle",
    size: Size.Sm,
    showUnsetHint: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled toggle",
    disabled: true,
    size: Size.Sm,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Disabled checked toggle",
    checked: true,
    disabled: true,
    size: Size.Sm,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle checked label="Small" size={Size.Sm} />
      <Toggle checked label="Medium" size={Size.Md} />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: {
    size: Size.Sm,
  },
};

export default meta;
