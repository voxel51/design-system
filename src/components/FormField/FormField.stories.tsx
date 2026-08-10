import type { Meta, StoryObj } from "@storybook/react-vite";

import { FormField, Input } from "@voxel51/voodo";

import { withContainer } from "../../../stories/decorators/container";
import { generateWords } from "../../../utils/text";

const meta: Meta<typeof FormField> = {
  title: "Components/FormField",
  component: FormField,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: {
      control: "text",
      description: "The label for the field",
    },
    description: {
      control: "text",
      description: "The description for the field",
    },
    error: {
      control: "text",
      description: "The error message for the field",
    },
    disabled: {
      control: "boolean",
      description: "Whether the field is disabled",
    },
  },
  decorators: [withContainer()],
};

type Story = StoryObj<typeof FormField>;

export const BasicExample: Story = {
  args: {
    control: <Input />,
    label: generateWords(2),
    description: generateWords(5),
  },
};

export const RawInput: Story = {
  args: {
    control: <Input />,
  },
};

export const WithLabel: Story = {
  args: {
    control: <Input />,
    label: generateWords(2),
  },
};

export const WithDescription: Story = {
  args: {
    control: <Input />,
    label: generateWords(2),
    description: generateWords(5),
  },
};

export const Disabled: Story = {
  args: {
    control: <Input disabled />,
    label: generateWords(2),
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    control: <Input error={true} />,
    label: generateWords(2),
    description: generateWords(5),
    error: generateWords(5),
  },
};

export default meta;
