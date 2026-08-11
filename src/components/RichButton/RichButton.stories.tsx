import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconName, RichButton } from "@voxel51/voodo";

import { generateWords } from "../../../utils/text";

const meta: Meta<typeof RichButton> = {
  title: "Components/RichButton",
  component: RichButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "The label for the button",
    },
    description: {
      control: "text",
      description: "The description for the button",
    },
    icon: {
      control: "select",
      description: "Optional icon to display",
      options: [undefined, ...Object.values(IconName)],
    },
    active: {
      control: "boolean",
      description: "Whether the button is active",
    },
  },
};

type Story = StoryObj<typeof RichButton>;

export const FullExample: Story = {
  args: {
    label: generateWords(2),
    description: generateWords(5),
    icon: IconName.Code,
  },
};

export const Basic: Story = {
  args: {
    label: generateWords(2),
  },
};

export const WithIcon: Story = {
  args: {
    label: generateWords(2),
    icon: IconName.Code,
  },
};

export const WithDescription: Story = {
  args: {
    label: generateWords(2),
    description: generateWords(5),
  },
};

export const Active: Story = {
  args: {
    label: generateWords(2),
    active: true,
  },
};

export const WithClickHandler: Story = {
  args: {
    label: generateWords(2),
    onClick: () => {
      alert("clicked!");
    },
  },
};

export default meta;
