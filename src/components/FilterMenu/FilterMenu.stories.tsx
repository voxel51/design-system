import type { Meta, StoryObj } from "@storybook/react-vite";

import { FilterMenu, Input, type FilterMenuProps } from "@voxel51/voodo";

const meta: Meta<typeof FilterMenu> = {
  title: "Components/FilterMenu",
  component: FilterMenu,
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof FilterMenu>;

const Row = (props: Partial<FilterMenuProps>) => (
  <div className="flex max-w-sm gap-2">
    <div className="flex-1">
      <Input placeholder="Search" />
    </div>
    <FilterMenu {...props}>
      <label>
        <input type="checkbox" /> Mine only
      </label>
      <label>
        <input type="checkbox" /> Images
      </label>
    </FilterMenu>
  </div>
);

export const Default: Story = { render: () => <Row /> };

export const Active: Story = {
  render: () => <Row activeCount={2} onClear={() => undefined} />,
};

export const IconOnly: Story = {
  render: () => <Row activeCount={1} iconOnly />,
};
