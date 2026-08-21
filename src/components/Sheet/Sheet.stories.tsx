import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";

import {
  Button,
  Orientation,
  Sheet,
  SheetSide,
  Spacing,
  Stack,
  Text,
  TextColor,
} from "@voxel51/voodo";

import { generateWords } from "../../../utils/text";

const meta: Meta<typeof Sheet> = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["!autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    side: { control: "radio", options: Object.values(SheetSide) },
  },
};

type Story = StoryObj<typeof Sheet>;

function Demo(args: Partial<ComponentProps<typeof Sheet>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={(): void => setOpen(true)}>Open</Button>
      <Sheet
        title={generateWords(2)}
        {...args}
        open={open}
        onClose={(): void => setOpen(false)}
      >
        <Stack orientation={Orientation.Column} spacing={Spacing.Md}>
          {Array.from({ length: 12 }, (_, i) => (
            <Text key={i} color={TextColor.Secondary}>
              {generateWords(12)}
            </Text>
          ))}
        </Stack>
      </Sheet>
    </>
  );
}

export const Right: Story = { render: (args) => <Demo {...args} /> };

export const Left: Story = {
  render: (args) => <Demo {...args} side={SheetSide.Left} />,
};

export const Wide: Story = {
  render: (args) => <Demo {...args} width={720} />,
};

export default meta;
