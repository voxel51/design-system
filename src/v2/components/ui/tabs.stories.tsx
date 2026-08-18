import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@voxel51/voodo/v2";

/**
 * Switches between sibling panels. Arrow keys move between triggers; only
 * the active panel is in the accessibility tree.
 *
 * For the underlined page-level variant used across settings, see
 * `UnderlineTabs`.
 */
const meta: Meta<typeof Tabs> = {
  title: "v2/Components/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
        <TabsTrigger value="config">Config</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-4 text-body-sm">
        Running for 3h 12m on 4 workers.
      </TabsContent>
      <TabsContent value="logs" className="pt-4 font-mono text-meta">
        12:04:11 workflow started
      </TabsContent>
      <TabsContent value="config" className="pt-4 text-body-sm">
        Endpoint https://argo.internal:2746
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="a" className="w-96">
      <TabsList>
        <TabsTrigger value="a">Available</TabsTrigger>
        <TabsTrigger value="b" disabled>
          Requires admin
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a" className="pt-4 text-body-sm">
        Anyone can see this.
      </TabsContent>
    </Tabs>
  ),
};
