import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BackgroundColor,
  IconName,
  Pill,
  Radius,
  SemanticColor,
  Shadow,
  Size,
  StatusColor,
  TextColor,
} from "@voxel51/voodo";

const meta: Meta<typeof Pill> = {
  title: "Components/Pill",
  component: Pill,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: [Size.Xs, Size.Sm, Size.Md],
      description: "The size of the pill",
    },
    isStatus: {
      control: "boolean",
      description: "Whether the pill is a status pill",
    },
    radius: {
      control: "select",
      options: Object.values(Radius),
      description: "The radius of the pill",
    },
    shadow: {
      control: "select",
      options: Object.values(Shadow),
      description: "The border shadow applied to the pill",
    },
    color: {
      control: "select",
      options: Object.values(TextColor),
      description: "The text color of the pill",
    },
    backgroundColor: {
      control: "select",
      options: [
        ...Object.values(BackgroundColor),
        ...Object.values(SemanticColor),
        ...Object.values(StatusColor),
      ],
      description: "The background color of the pill",
    },
    children: {
      control: "text",
      description: "Pill text content",
    },
  },
};

type Story = StoryObj<typeof Pill>;

export const Primary: Story = {
  args: {
    children: "Read-only",
    size: Size.Sm,
    radius: Radius.Full,
    shadow: undefined,
    isStatus: true,
  },
};

export const Approved: Story = {
  args: {
    children: "Approved",
    size: Size.Sm,
    radius: Radius.Full,
    isStatus: true,
    color: TextColor.Success,
  },
};

export const InReview: Story = {
  args: {
    children: "In Review",
    size: Size.Sm,
    radius: Radius.Full,
    isStatus: true,
    color: TextColor.Warning,
  },
};

export const Failed: Story = {
  args: {
    children: "Failed",
    size: Size.Sm,
    radius: Radius.Full,
    isStatus: true,
    backgroundColor: SemanticColor.Destructive,
    color: TextColor.Primary,
  },
};

export const ExtraSmall: Story = {
  args: {
    children: "New",
    size: Size.Xs,
    radius: Radius.Full,
    shadow: undefined,
  },
};

export const Small: Story = {
  args: {
    children: "Active",
    size: Size.Sm,
    radius: Radius.Full,
    shadow: undefined,
  },
};


export const WithIcon: Story = {
  args: {
    children: "Custom",
    size: Size.Sm,
    radius: Radius.Full,
    shadow: undefined,
    color: TextColor.Placeholder,
    backgroundColor: StatusColor.Progress,
    icon: IconName.Check,
  },
};

export const Medium: Story = {
  args: {
    children: "Featured",
    size: Size.Md,
    radius: Radius.Full,
    shadow: undefined,
  },
};

export const WithShadow: Story = {
  args: {
    children: "Premium",
    size: Size.Sm,
    radius: Radius.Full,
    shadow: Shadow.Md,
  },
};

export const WithLargeShadow: Story = {
  args: {
    children: "Highlighted",
    size: Size.Sm,
    radius: Radius.Full,
    shadow: Shadow.Lg,
  },
};

export const Rounded: Story = {
  args: {
    children: "Rounded",
    size: Size.Sm,
    radius: Radius.Lg,
    shadow: undefined,
  },
};

export const Square: Story = {
  args: {
    children: "Square",
    size: Size.Sm,
    radius: Radius.None,
    shadow: undefined,
  },
};

export const CustomColors: Story = {
  args: {
    children: "Custom",
    size: Size.Sm,
    radius: Radius.Full,
    shadow: undefined,
    color: TextColor.Placeholder,
    backgroundColor: StatusColor.Progress,
  },
};


export default meta;
