import type { Meta, StoryObj } from "@storybook/react-vite";

import { StepRail } from "@voxel51/voodo";

const meta: Meta<typeof StepRail> = {
  title: "Components/StepRail",
  component: StepRail,
  parameters: { layout: "centered" },
  argTypes: {
    current: {
      control: "select",
      options: ["source", "location", "review", "import"],
    },
  },
};

type Story = StoryObj<typeof StepRail>;

export const Default: Story = {
  args: {
    current: "location",
    steps: [
      { id: "source", label: "Source" },
      { id: "location", label: "Location" },
      { id: "review", label: "Review" },
      { id: "import", label: "Import" },
    ],
  },
};

export const Revisitable: Story = {
  args: { ...Default.args, current: "review", onSelect: () => undefined },
};

export default meta;
