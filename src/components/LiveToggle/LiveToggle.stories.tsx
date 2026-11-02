import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { LiveToggle } from "@voxel51/voodo";

const meta: Meta<typeof LiveToggle> = {
  title: "Components/LiveToggle",
  component: LiveToggle,
};

type Story = StoryObj<typeof LiveToggle>;

const Stateful = (args: { active?: boolean }) => {
  const [checked, setChecked] = useState(true);
  return (
    <LiveToggle
      checked={checked}
      onCheckedChange={setChecked}
      active={args.active}
      onRefresh={() => undefined}
      title="Refreshes every 5 seconds"
    />
  );
};

export const Refreshing: Story = { render: () => <Stateful active /> };

export const Idle: Story = { render: () => <Stateful active={false} /> };

export default meta;
