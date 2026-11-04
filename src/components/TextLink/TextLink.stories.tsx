import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text, TextLink } from "@voxel51/voodo";

const meta: Meta<typeof TextLink> = {
  title: "Components/TextLink",
  component: TextLink,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { href: "https://docs.voxel51.com", external: true, children: "docs" },
};
export default meta;

type Story = StoryObj<typeof TextLink>;

export const InText: Story = {
  render: (args) => (
    <Text variant="body-secondary" color="text-secondary">
      Read the <TextLink {...args} /> to learn more.
    </Text>
  ),
};

export const Accent: Story = { args: { accent: true } };

export const Truncated: Story = {
  render: (args) => (
    <div style={{ width: 160 }}>
      <TextLink {...args} truncate>
        https://orchestrator.example.com/runs/0123456789abcdef
      </TextLink>
    </div>
  ),
};
