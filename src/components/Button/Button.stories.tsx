import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, IconName, Size, Variant } from "@voxel51/voodo";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: Object.values(Variant),
      description: "The visual style of the button",
    },
    size: {
      control: "select",
      options: Object.values(Size),
      description: "The size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    borderless: {
      control: "boolean",
      description: "Whether the button is borderless",
    },
    leadingIcon: {
      control: "select",
      description: "Optional leading icon to display",
      options: [undefined, ...Object.values(IconName)],
    },
    trailingIcon: {
      control: "select",
      description: "Optional trailing icon to display",
      options: [undefined, ...Object.values(IconName)],
    },
    children: {
      control: "text",
      description: "Button text content",
    },
  },
};

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Primary,
    size: Size.Md,
  },
};

export const Secondary: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Secondary,
    size: Size.Md,
  },
};

export const Success: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Success,
    size: Size.Md,
  },
};

export const Danger: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Danger,
    size: Size.Md,
  },
};

export const ExtraSmall: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Primary,
    size: Size.Xs,
  },
};

export const Small: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Primary,
    size: Size.Sm,
  },
};

export const Medium: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Primary,
    size: Size.Md,
  },
};

export const Disabled: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Primary,
    disabled: true,
  },
};

export const WithClickHandler: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Primary,
    onClick: () => alert("Button clicked!"),
  },
};

export const WithLeadingIcon: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Primary,
    leadingIcon: IconName.Delete,
  },
};

export const WithTrailingIcon: Story = {
  args: {
    children: "Click this button",
    variant: Variant.Primary,
    trailingIcon: IconName.Delete,
  },
};

export const Borderless: Story = {
  args: {
    children: "Click this button",
    borderless: true,
  },
};

export const IconOnly: Story = {
  args: {
    leadingIcon: IconName.Delete,
    variant: Variant.Icon,
  },
};

export default meta;
