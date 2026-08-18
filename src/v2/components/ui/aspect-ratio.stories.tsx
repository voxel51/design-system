import type { Meta, StoryObj } from "@storybook/react-vite";

import { AspectRatio } from "@voxel51/voodo/v2";

/**
 * Locks a child to a fixed width-to-height ratio, reserving the space before
 * content loads so nothing shifts.
 *
 * Useful for sample thumbnails and video, where the media dimensions are not
 * known until it arrives.
 */
const meta: Meta<typeof AspectRatio> = {
  title: "v2/Components/AspectRatio",
  component: AspectRatio,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof AspectRatio>;

export const Ratios: Story = {
  render: () => (
    <div className="flex w-[36rem] gap-4">
      {[
        { ratio: 16 / 9, label: "16:9" },
        { ratio: 4 / 3, label: "4:3" },
        { ratio: 1, label: "1:1" },
      ].map((r) => (
        <div key={r.label} className="flex-1">
          <AspectRatio ratio={r.ratio}>
            <div className="flex h-full w-full items-center justify-center rounded-md bg-card-2 text-meta text-secondary-foreground">
              {r.label}
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
};
