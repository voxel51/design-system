import type { Meta, StoryObj } from "@storybook/react-vite";

import { UserBadge } from "@voxel51/voodo/v2";

/**
 * Inline identity chip — avatar initials plus name. Use it everywhere a
 * person appears in metadata ("Run by", "Created by", assignees) so identity
 * reads the same way throughout.
 *
 * Initials come from the name, splitting on whitespace, dots, underscores and
 * hyphens. A missing name renders as "Unknown" rather than an empty circle.
 */
const meta: Meta<typeof UserBadge> = {
  title: "v2/Components/UserBadge",
  component: UserBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { size: { control: "select", options: ["sm", "md"] } },
};
export default meta;

type Story = StoryObj<typeof UserBadge>;

export const Default: Story = { args: { name: "Ritchie Martori" } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <UserBadge name="Sejal Kotak" size="sm" />
      <UserBadge name="Sejal Kotak" size="md" />
    </div>
  ),
};

/** Initials are derived from several separator styles. */
export const NameFormats: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <UserBadge name="Tim Mendoza" />
      <UserBadge name="michael.obrien" />
      <UserBadge name="ibrahim_manjra" />
      <UserBadge name={null} />
    </div>
  ),
};
