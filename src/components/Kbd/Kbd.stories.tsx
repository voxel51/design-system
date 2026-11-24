import type { Meta, StoryObj } from "@storybook/react-vite";

import { Kbd, Stack, Text } from "@voxel51/voodo";

const meta: Meta<typeof Kbd> = {
  title: "Components/Kbd",
  component: Kbd,
  parameters: {
    layout: "centered",
  },
  args: { children: "E" },
};

type Story = StoryObj<typeof Kbd>;

export const Default: Story = {};

export const Word: Story = {
  args: { children: "Esc" },
};

export const Small: Story = {
  args: { size: "sm", children: "Esc" },
};

export const Sizes: Story = {
  render: () => (
    <Stack orientation="row" spacing="sm" align="center">
      <Kbd size="sm">⌘Z</Kbd>
      <Kbd size="md">⌘Z</Kbd>
    </Stack>
  ),
};

export const ShortcutRow: Story = {
  render: () => (
    <Stack orientation="row" spacing="sm" align="center">
      <Text variant="body-secondary">Undo</Text>
      <Kbd>⌘Z</Kbd>
    </Stack>
  ),
};

export default meta;
