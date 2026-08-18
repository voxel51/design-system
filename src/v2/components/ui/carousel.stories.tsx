import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@voxel51/voodo/v2";

/**
 * Horizontal slide track on Embla, with previous and next controls. Supports
 * pointer drag and keyboard arrows.
 *
 * Suits a small, ordered set — sample previews, onboarding steps. A long list
 * belongs in a scroll container where the scrollbar shows position.
 */
const meta: Meta<typeof Carousel> = {
  title: "v2/Components/Carousel",
  component: Carousel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => (
    <Carousel className="w-72">
      <CarouselContent>
        {Array.from({ length: 5 }, (_, i) => (
          <CarouselItem key={i}>
            <div className="flex aspect-square items-center justify-center rounded-lg bg-card-2 text-display text-secondary-foreground">
              {i + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/** `basis-*` on the item shows several slides at once. */
export const MultipleVisible: Story = {
  render: () => (
    <Carousel className="w-[32rem]">
      <CarouselContent>
        {Array.from({ length: 8 }, (_, i) => (
          <CarouselItem key={i} className="basis-1/3">
            <div className="flex aspect-video items-center justify-center rounded-md bg-card-2 text-body-sm text-secondary-foreground">
              sample {i + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
