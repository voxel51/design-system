import type { Meta, StoryObj } from "@storybook/react-vite";

import { CountPill, CountPillTone, Size } from "@voxel51/voodo";

const meta: Meta<typeof CountPill> = {
  title: "Components/CountPill",
  component: CountPill,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: { control: "select", options: [Size.Sm, Size.Md, Size.Lg] },
    tone: { control: "select", options: Object.values(CountPillTone) },
  },
};

type Story = StoryObj<typeof CountPill>;

export const Default: Story = {
  args: { value: 4 },
};

/** Every Figma tone at every size. */
export const Grid: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {Object.values(CountPillTone).map((tone) => (
        <div key={tone} className="flex items-center gap-3">
          {[Size.Sm, Size.Md, Size.Lg].map((size) => (
            <CountPill key={size} value={4} size={size} tone={tone} />
          ))}
          <CountPill value={1280} tone={tone} />
        </div>
      ))}
    </div>
  ),
};

export default meta;
