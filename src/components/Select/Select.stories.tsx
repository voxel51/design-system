import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Orientation,
  Select,
  SelectAnchor,
  SelectProps,
  Spacing,
  Stack,
  Text,
  TextColor,
  TextVariant,
} from "@voxel51/voodo";

import { withContainer } from "../../../stories/decorators/container";
import { generateWords } from "../../../utils/text";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    exclusive: {
      control: "boolean",
      description: "Whether the selection is restricted to a single value",
    },
  },
  decorators: [withContainer()],
};

type Story = StoryObj<typeof Select>;

const defaultOptions = new Array(5).fill(0).map((_, i) => ({
  id: `option-${i}`,
  data: { label: generateWords(3) },
}));

const defaultArgs: Partial<SelectProps> = {
  options: defaultOptions,
  onChange: (value: string | string[] | null) => console.log({ value }),
};

export const Controlled: Story = {
  args: {
    ...defaultArgs,
    value: defaultOptions.filter((_, i) => i % 2 === 0).map((opt) => opt.id),
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(args.value as string[]);
    return (
      <Select
        {...args}
        value={value}
        onChange={(next) => {
          args.onChange?.(next);
          setValue(Array.isArray(next) ? next : next ? [next] : []);
        }}
      />
    );
  },
};

export const Uncontrolled: Story = {
  args: {
    ...defaultArgs,
    exclusive: true,
  },
};

export const UncontrolledMultiSelect: Story = {
  args: {
    ...defaultArgs,
  },
};

export const WithRichContent: Story = {
  args: {
    ...defaultArgs,
    options: new Array(5).fill(0).map((_, i) => ({
      id: `rich-option-${i}`,
      data: {
        label: generateWords(3),
        content: (
          <Stack
            orientation={Orientation.Row}
            spacing={Spacing.Md}
            className="items-center"
          >
            <span className="flex items-center size-5">
              <WrenchScrewdriverIcon />
            </span>

            <Stack orientation={Orientation.Column}>
              <Text variant={TextVariant.Label} color={TextColor.Info}>
                {generateWords(3)}
              </Text>
              <Text variant={TextVariant.Caption}>{generateWords(4)}</Text>
            </Stack>
          </Stack>
        ),
      },
    })),
    exclusive: true,
  },
};

export const Unset: Story = {
  args: {
    ...defaultArgs,
    exclusive: true,
  },
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    exclusive: true,
    disabled: true,
  },
};

export const AnchoredTop: Story = {
  args: {
    ...defaultArgs,
    exclusive: true,
    anchor: SelectAnchor.TopStart,
  },
};

export const Portal: Story = {
  args: {
    ...defaultArgs,
    exclusive: true,
    portal: true,
  },
};

export default meta;
