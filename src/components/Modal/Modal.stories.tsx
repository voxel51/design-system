import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";

import {
  Button,
  Modal,
  ModalSize,
  Orientation,
  Spacing,
  Stack,
  Text,
  TextColor,
  Variant,
} from "@voxel51/voodo";

import { generateWords } from "../../../utils/text";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["!autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(ModalSize),
    },
  },
};

type Story = StoryObj<typeof Modal>;

/**
 * Stories drive the modal from a trigger rather than rendering it open, so the
 * backdrop, focus trap, and Escape handling are all exercised.
 */
function Demo({ children, ...args }: Partial<ComponentProps<typeof Modal>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Modal
        title={generateWords(3)}
        {...args}
        open={open}
        onClose={() => setOpen(false)}
      >
        {children ?? <Text>{generateWords(30)}</Text>}
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: (args) => <Demo {...args} />,
};

export const WithFooter: Story = {
  render: (args) => (
    <Demo
      {...args}
      footer={
        <>
          <Button variant={Variant.Secondary}>Cancel</Button>
          <Button>Save</Button>
        </>
      }
    />
  ),
};

export const Scrolling: Story = {
  render: (args) => (
    <Demo {...args} size={ModalSize.Lg}>
      <Stack orientation={Orientation.Column} spacing={Spacing.Md}>
        {Array.from({ length: 24 }, (_, i) => (
          <Text key={i} color={TextColor.Secondary}>
            {generateWords(14)}
          </Text>
        ))}
      </Stack>
    </Demo>
  ),
};

export const Untitled: Story = {
  render: (args) => (
    <Demo {...args} title={undefined} aria-label="Untitled modal" />
  ),
};

export default meta;
