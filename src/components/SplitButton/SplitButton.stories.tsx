import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { MenuCheckItem, SplitButton } from "@voxel51/voodo";

const meta: Meta<typeof SplitButton> = {
  title: "Components/SplitButton",
  component: SplitButton,
};

type Story = StoryObj<typeof SplitButton>;

const RunModes = () => {
  const [mode, setMode] = useState("execute");
  return (
    <SplitButton
      menuLabel="Run options"
      menu={
        <>
          <MenuCheckItem
            select
            checked={mode === "execute"}
            description="Run now, in the browser session"
            onClick={() => setMode("execute")}
          >
            Execute
          </MenuCheckItem>
          <MenuCheckItem
            select
            checked={mode === "schedule"}
            description="Run on your compute cluster"
            onClick={() => setMode("schedule")}
          >
            Schedule
          </MenuCheckItem>
        </>
      }
    >
      {mode === "execute" ? "Execute" : "Schedule"}
    </SplitButton>
  );
};

export const Default: Story = { render: () => <RunModes /> };

export const Disabled: Story = {
  render: () => (
    <SplitButton disabled hint="Fix the form first" menu={<span />}>
      Execute
    </SplitButton>
  ),
};

export default meta;
