import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Tab, Tabs } from "@voxel51/voodo";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description: "The bar's tabs",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const WORKSPACE_TABS = [
  { label: "Datasets", count: 15 },
  { label: "Models", count: 18 },
  { label: "Settings" },
];

const Workspace = () => {
  const [active, setActive] = useState("Datasets");

  return (
    <Tabs aria-label="Workspace">
      {WORKSPACE_TABS.map(({ label, count }) => (
        <Tab
          key={label}
          active={label === active}
          count={count}
          onClick={() => setActive(label)}
        >
          {label}
        </Tab>
      ))}
    </Tabs>
  );
};

export const Primary: Story = {
  render: () => <Workspace />,
};

export const WithoutCounts: Story = {
  render: () => (
    <Tabs aria-label="Dataset">
      <Tab active>Samples</Tab>
      <Tab>Annotate</Tab>
      <Tab>Runs</Tab>
    </Tabs>
  ),
};

export const Links: Story = {
  render: () => (
    <Tabs aria-label="Workspace">
      <Tab active href="#datasets" count={15}>
        Datasets
      </Tab>
      <Tab href="#settings">Settings</Tab>
    </Tabs>
  ),
};

export const InAHeader: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <header className="flex h-12 items-center gap-6 border-b border-content-border-default px-5">
      <span className="text-lg font-medium text-content-text-primary">
        Voxel51
      </span>
      <Workspace />
    </header>
  ),
};
