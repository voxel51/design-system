import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Orientation,
  Select,
  SelectProps,
  Spacing,
  Stack,
  Text,
  TextColor,
  TextVariant,
} from "@voxel51/voodo";
import { generateWords } from "../utils/text";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { withContainer } from "./decorators/container";

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

const defaultArgs: Partial<SelectProps> = {
  options: new Array(5).fill(0).map(() => ({
    id: Math.random().toString(36).substring(2, 9),
    data: { label: generateWords(3) },
  })),
  onChange: (value: string | string[] | null) => console.log({ value }),
};

export const Controlled: Story = {
  args: {
    ...defaultArgs,
    value: defaultArgs.options
      .filter((_, i) => i % 2 === 0)
      .map((opt) => opt.id),
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
    options: new Array(5).fill(0).map(() => ({
      id: Math.random().toString(36).substring(2, 9),
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
              <Text variant={TextVariant.Label} color={TextColor.SemanticInfo}>
                {generateWords(3)}
              </Text>
              <Text variant={TextVariant.Caption}>{generateWords(4)}</Text>
            </Stack>
          </Stack>
        ),
      },
    })),
  },
  exclusive: true,
};

export const Unset: Story = {
  args: {
    ...defaultArgs,
    exclusive: true,
  },
};

export default meta;
