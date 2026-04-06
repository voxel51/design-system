import type { Meta, StoryObj } from "@storybook/react-vite";
import { Descriptor, RichButtonGroup, RichButtonProps } from "@voxel51/voodo";
import { generateWords } from "../../stories/utils/text";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";

const meta: Meta<typeof RichButtonGroup> = {
  title: "Components/RichButtonGroup",
  component: RichButtonGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    exclusive: {
      control: "boolean",
      description: "Whether button selection is mutually exclusive",
    },
  },
};

type Story = StoryObj<typeof RichButtonGroup>;

const buildButtonProps = (numButtons = 3): Descriptor<RichButtonProps>[] =>
  new Array(numButtons).fill(0).map(() => {
    const buttonId = Math.random().toString(36).substring(2, 9);

    return {
      id: buttonId,
      data: {
        label: generateWords(2),
        icon: WrenchScrewdriverIcon,
        description: generateWords(5),
        onClick: () => {
          console.log(`Clicked ${buttonId}`);
        },
      },
    };
  });

export const ExclusiveSelection: Story = {
  args: {
    buttons: buildButtonProps(),
    exclusive: true,
    onChange: (selected: string[]) => {
      console.log({ selected });
    },
  },
};

export const MultipleSelection: Story = {
  args: {
    buttons: buildButtonProps(),
    onChange: (selected: string[]) => {
      console.log({ selected });
    },
  },
};

export const Controlled: Story = {
  args: {
    buttons: buildButtonProps(),
  },
  render: (args) => {
    const [active, setActive] = useState<string[]>(() => []);

    const onChange = useCallback(
      (newActive: string[]) => setActive(newActive),
      [setActive]
    );

    return <RichButtonGroup {...args} active={active} onChange={onChange} />;
  },
};

export default meta;
