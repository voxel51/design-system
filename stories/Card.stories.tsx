import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Text, Variant } from "@voxel51/voodo";
import { generateWords } from "../utils/text";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["!autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {},
};

type Story = StoryObj<typeof Card>;

const defaultArgs = {
  open: true,
  icon: WrenchScrewdriverIcon,
  title: generateWords(4),
  description: generateWords(6),
  action: <Button variant={Variant.Secondary}>{generateWords(2)}</Button>,
};

export const Default: Story = {
  args: {},
  render: (args) => (
    <Card {...defaultArgs} {...args}>
      <Text>Card content</Text>
    </Card>
  ),
};

export default meta;
