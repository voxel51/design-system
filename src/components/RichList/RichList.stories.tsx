import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Clickable,
  Descriptor,
  Icon,
  IconName,
  ListItemProps,
  RichList,
  Text,
} from "@voxel51/voodo";
import React, { useState } from "react";
import { generateSentences, generateWords } from "../../stories/utils/text";
import { withContainer } from "../../stories/decorators/container";

const meta: Meta<typeof RichList> = {
  title: "Components/RichList",
  component: RichList,
  parameters: {
    layout: "centered",
  },
  decorators: [withContainer()],
};

type Story = StoryObj<typeof RichList>;

export const WithSelectionState: Story = {
  args: {
    listItems: new Array(5).fill(0).map((_, i) => ({
      id: Math.random().toString(36).substring(2, 9),
      data: {
        canSelect: true,
        primaryContent: generateWords(4),
        secondaryContent: generateWords(3),
        actions: (
          <span className="flex items-center justify-center gap-x-md text-content-text-primary">
            <Clickable className="size-5">
              <Icon name={IconName.Delete} />
            </Clickable>
            <Clickable className="size-5">
              <Icon name={IconName.Settings} />
            </Clickable>
          </span>
        ),
      },
    })),
    onSelected: (selected: string[]) => console.log(selected),
  },
};

const createActions = () => (
  <span className="flex items-center justify-center gap-x-md text-content-text-primary">
    <Clickable className="size-5">
      <Icon name={IconName.Delete} />
    </Clickable>
    <Clickable className="size-5">
      <Icon name={IconName.Settings} />
    </Clickable>
  </span>
);

const initialItems: Descriptor<ListItemProps>[] = [
  {
    id: "1",
    data: {
      primaryContent: "First Item",
      secondaryContent: generateWords(3),
      actions: createActions(),
    },
  },
  {
    id: "2",
    data: {
      primaryContent: "Second Item",
      secondaryContent: generateWords(3),
      actions: createActions(),
    },
  },
  {
    id: "3",
    data: {
      primaryContent: "Third Item",
      secondaryContent: generateWords(3),
      actions: createActions(),
    },
  },
  {
    id: "4",
    data: {
      primaryContent: "Fourth Item",
      secondaryContent: generateWords(3),
      actions: createActions(),
    },
  },
  {
    id: "5",
    data: {
      primaryContent: "Fifth Item",
      secondaryContent: generateWords(3),
      actions: createActions(),
    },
  },
];

const DraggableRichList = (args: React.ComponentProps<typeof RichList>) => {
  const [items, setItems] = useState(() => args.listItems ?? initialItems);

  return (
    <RichList
      {...args}
      listItems={items}
      onOrderChange={(newItems) => {
        console.log(
          "New order:",
          newItems.map((item) => item.id)
        );
        setItems(newItems);
      }}
      onSelected={(selected: string[]) => console.log(selected)}
    />
  );
};

export const Draggable: Story = {
  args: {
    draggable: true,
  },
  render: (args) => <DraggableRichList {...args} />,
  parameters: {
    docs: {
      source: {
        code: `
const [items, setItems] = useState([
  {
    id: "1",
    data: {
      primaryContent: "First Item",
      secondaryContent: "Drag me!",
      actions: (
        <span className="flex items-center justify-center gap-x-md text-content-text-primary">
          <Clickable className="size-5"><TrashIcon /></Clickable>
          <Clickable className="size-5"><WrenchScrewdriverIcon /></Clickable>
        </span>
      ),
    },
  },
  {
    id: "2",
    data: {
      primaryContent: "Second Item",
      secondaryContent: "Drag me!",
      actions: (
        <span className="flex items-center justify-center gap-x-md text-content-text-primary">
          <Clickable className="size-5"><TrashIcon /></Clickable>
          <Clickable className="size-5"><WrenchScrewdriverIcon /></Clickable>
        </span>
      ),
    },
  },
  {
    id: "3",
    data: {
      primaryContent: "Third Item",
      secondaryContent: "Drag me!",
      actions: (
        <span className="flex items-center justify-center gap-x-md text-content-text-primary">
          <Clickable className="size-5"><TrashIcon /></Clickable>
          <Clickable className="size-5"><WrenchScrewdriverIcon /></Clickable>
        </span>
      ),
    },
  },
  {
    id: "4",
    data: {
      primaryContent: "Fourth Item",
      secondaryContent: "Drag me!",
      actions: (
        <span className="flex items-center justify-center gap-x-md text-content-text-primary">
          <Clickable className="size-5"><TrashIcon /></Clickable>
          <Clickable className="size-5"><WrenchScrewdriverIcon /></Clickable>
        </span>
      ),
    },
  },
  {
    id: "5",
    data: {
      primaryContent: "Fifth Item",
      secondaryContent: "Drag me!",
      actions: (
        <span className="flex items-center justify-center gap-x-md text-content-text-primary">
          <Clickable className="size-5"><TrashIcon /></Clickable>
          <Clickable className="size-5"><WrenchScrewdriverIcon /></Clickable>
        </span>
      ),
    },
  },
]);

<RichList
  listItems={items}
  draggable
  onOrderChange={(newItems) => {
    // Call your API here
    setItems(newItems);
  }}
/>
        `.trim(),
      },
    },
  },
};

export const DraggableWithSelection: Story = {
  args: {
    draggable: true,
    listItems: initialItems.map((item) => ({
      ...item,
      data: { ...item.data, canSelect: true },
    })),
  },
  render: (args) => <DraggableRichList {...args} />,
};

export const DraggableWithAdditionalContent: Story = {
  args: {
    draggable: true,
    listItems: initialItems.map((item) => ({
      ...item,
      data: {
        ...item.data,
        additionalContent: <Text>{generateSentences(1)}</Text>,
      },
    })),
  },
  render: (args) => <DraggableRichList {...args} />,
};

export const Controlled: Story = {
  args: {
    draggable: true,
    listItems: initialItems.map((item) => ({
      ...item,
      data: { ...item.data, canSelect: true },
    })),
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(() => ["1", "2"]);

    return (
      <DraggableRichList
        {...args}
        selected={selected}
        onSelected={(newSelected) => setSelected(newSelected)}
      />
    );
  },
};

export default meta;
