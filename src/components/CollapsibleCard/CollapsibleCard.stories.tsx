import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  CollapsibleCard,
  GridViewIcon,
  RadioGroup,
  SettingsIcon,
  TextAction,
} from "@voxel51/voodo";

const meta: Meta<typeof CollapsibleCard> = {
  title: "Components/CollapsibleCard",
  component: CollapsibleCard,
};

type Story = StoryObj<typeof CollapsibleCard>;

export const Default: Story = {
  render: () => (
    <div className="flex w-[480px] flex-col gap-6">
      <CollapsibleCard
        icon={GridViewIcon}
        title="Target"
        summary="All samples (200)"
      >
        <RadioGroup
          value="all"
          onChange={() => {}}
          options={[
            { value: "all", label: "All samples (200)" },
            { value: "view", label: "Current view (200)" },
          ]}
        />
      </CollapsibleCard>
      <CollapsibleCard
        icon={SettingsIcon}
        title="Settings"
        summary="Label field: predictions"
        defaultOpen={false}
        actions={<TextAction size="sm">Reset</TextAction>}
      >
        Settings
      </CollapsibleCard>
    </div>
  ),
};

export default meta;
