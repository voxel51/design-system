import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";

import { IconName, Input, InputType, Radius, Size } from "@voxel51/voodo";

import { withContainer } from "../../../stories/decorators/container";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: [Size.Sm, Size.Md, Size.Lg],
      description: "The size of the input",
    },
    error: {
      control: "text",
      description: "The error message to display in the input",
    },
    type: {
      control: "select",
      options: Object.values(InputType),
      description: "The input type",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    radius: {
      control: "select",
      options: Object.values(Radius),
      description: "The border radius of the input",
    },
    icon: {
      control: "select",
      description: "Optional icon to display",
      options: [undefined, ...Object.values(IconName)],
    },
  },
  decorators: [withContainer()],
};

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    size: Size.Sm,
    placeholder: "Enter text...",
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setValue(e.target.value);
    };
    return (
      <Input placeholder="Controlled" value={value} onChange={handleChange} />
    );
  },
};

export const WithIcon: Story = {
  args: {
    icon: IconName.Search,
    placeholder: "Search...",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Input size={Size.Sm} placeholder="Small input" />
      <Input size={Size.Md} placeholder="Medium input" />
      <Input size={Size.Lg} placeholder="Large input" />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Input type={InputType.Number} placeholder="Enter your age" />
      <Input type={InputType.Email} placeholder="you@example.com" />
      <Input type={InputType.Search} placeholder="Search..." />
      <Input type={InputType.Password} placeholder="Enter your password" />
      <Input type={InputType.Tel} placeholder="Enter your phone number" />
      <Input type={InputType.Url} placeholder="Enter your website" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "you@example.com",
    disabled: true,
    value: "disabled@example.com",
  },
};

export const Unset: Story = {
  args: {
    placeholder: "you@example.com",
    value: undefined,
  },
  argTypes: {
    value: {
      control: "text",
      description: "The value of the input",
    },
  },
};

export const Errored: Story = {
  args: {
    placeholder: "you@example.com",
    error: true,
  },
};

export const ReadOnly: Story = {
  args: {
    value: "user@example.com",
    readOnly: true,
  },
};

export default meta;
