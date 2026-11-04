import type { Meta, StoryObj } from "@storybook/react-vite";

import { MetaList } from "@voxel51/voodo";

const meta: Meta<typeof MetaList> = {
  title: "Components/MetaList",
  component: MetaList,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof MetaList>;

export const Default: Story = {
  render: () => (
    <MetaList>
      <span>Dev User</span>
      <span>Started 7 days ago</span>
      <span>Ran for 7s</span>
    </MetaList>
  ),
};
