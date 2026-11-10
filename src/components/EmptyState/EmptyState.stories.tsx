import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  AnnotationEmptyArt,
  Button,
  EmptyState,
  IconName,
} from "@voxel51/voodo";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  // Fills its container; a bounded column keeps the story readable.
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title text of the EmptyState",
    },
    description: {
      control: "text",
      description: "The description text of the EmptyState",
    },
    icon: {
      control: "select",
      options: Object.values(IconName),
      description: "An icon to display on the card",
    },
  },
};

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: IconName.Draw,
    title: "EmptyState with label",
  },
};

export const WithDescription: Story = {
  args: {
    icon: IconName.Draw,
    title: "EmptyState with label",
    description: "This is an empty state with a description",
  },
};

export const SmallWithArt: Story = {
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
  args: {
    size: "sm",
    art: <AnnotationEmptyArt />,
    title: "Start labelling this sample",
    description: "Pick a tool above and draw on the image.",
  },
};

export default meta;

export const WithActionsAndSteps: Story = {
  decorators: [
    (Story) => (
      <div className="w-[720px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    art: <AnnotationEmptyArt />,
    title: "Connect to your data source",
    description: "Explore samples in your external data sources.",
    actions: (
      <Button variant="primary" size="sm">
        Add data source
      </Button>
    ),
    docsHref: "https://docs.voxel51.com",
    stepsTitle: "How it works",
    steps: [
      {
        icon: IconName.Code,
        title: "1. Define your pipeline",
        description: "Tell FiftyOne how to query your data source.",
      },
      {
        icon: IconName.Add,
        title: "2. Connect your data source",
        description: "Register your operator to connect to a data source.",
      },
    ],
  },
};
