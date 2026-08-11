import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, IconName, RichCard, Variant } from "@voxel51/voodo";

const meta: Meta<typeof RichCard> = {
  title: "Components/RichCard",
  component: RichCard,
  tags: ["!autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: {
      control: "text",
      description: "The title of the card",
    },
    badge: {
      control: "text",
      description: "A badge to display on the card",
    },
    description: {
      control: "text",
      description: "A description of the card",
    },
    icon: {
      control: "select",
      options: Object.values(IconName),
      description: "An icon to display on the card",
    },
  },
};

type Story = StoryObj<typeof RichCard>;

export const Default: Story = {
  args: {
    title: "Title",
    badge: "Badge",
    description: "This is a description of the RichCard.",
    icon: IconName.Code,
    action: (
      <Button variant={Variant.Primary} className="w-full">
        Action
      </Button>
    ),
  },
  render: (args) => <RichCard {...args} />,
};

export const Compact: Story = {
  args: {
    title: "Title",
    description: "This is a description of the RichCard.",
    icon: IconName.Code,
    action: (
      <Button variant={Variant.Primary} className="w-full">
        Action
      </Button>
    ),
    compact: true,
  },
  render: (args) => <RichCard {...args} />,
};

export const Outlined: Story = {
  args: {
    title: "Title",
    badge: "Badge",
    description: "This is a description of the RichCard.",
    icon: IconName.Code,
    action: (
      <Button variant={Variant.Primary} className="w-full">
        Action
      </Button>
    ),
    outlined: true,
  },
  render: (args) => <RichCard {...args} />,
};

export const CompactOutlined: Story = {
  args: {
    title: "Title",
    description: "This is a description of the RichCard.",
    icon: IconName.Code,
    action: (
      <Button variant={Variant.Primary} className="w-full">
        Action
      </Button>
    ),
    compact: true,
    outlined: true,
  },
  render: (args) => <RichCard {...args} />,
};

export default meta;
