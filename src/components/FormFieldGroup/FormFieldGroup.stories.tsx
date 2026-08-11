import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  FormField,
  FormFieldGroup,
  Input,
  Orientation,
  Spacing,
} from "@voxel51/voodo";

import { withContainer } from "../../../stories/decorators/container";
import { generateWords } from "../../../utils/text";

const Fields = () => (
  <>
    <FormField
      control={<Input />}
      label={generateWords(2)}
      description={generateWords(5)}
    />
    <FormField
      control={<Input error={true} />}
      label={generateWords(2)}
      description={generateWords(5)}
      error={generateWords(5)}
    />
    <FormField
      control={<Input />}
      label={generateWords(2)}
      description={generateWords(5)}
    />
  </>
);

const meta: Meta<typeof FormFieldGroup> = {
  title: "Components/FormFieldGroup",
  component: FormFieldGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: Object.values(Orientation),
      description: "The orientation of the field group",
    },
    spacing: {
      control: "select",
      options: Object.values(Spacing),
      description: "The spacing between form fields",
    },
    disabled: {
      control: "boolean",
      description: "Whether the field group is disabled",
    },
  },
  decorators: [withContainer()],
};

type Story = StoryObj<typeof FormFieldGroup>;

export const BasicExample: Story = {
  args: {
    children: <Fields />,
  },
};

export const Vertical: Story = {
  args: {
    orientation: Orientation.Column,
    children: <Fields />,
  },
};

export const Horizontal: Story = {
  args: {
    orientation: Orientation.Row,
    children: <Fields />,
  },
};

export const Disabled: Story = {
  args: {
    children: <Fields />,
    disabled: true,
  },
};

export default meta;
