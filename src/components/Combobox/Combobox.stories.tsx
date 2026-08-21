import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";

import { Combobox, type ComboboxOption } from "@voxel51/voodo";

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["!autodocs"],
  parameters: { layout: "centered" },
};

type Story = StoryObj<typeof Combobox>;

const DATASETS: ComboboxOption[] = [
  { id: "1", label: "quickstart" },
  { id: "2", label: "quickstart-groups" },
  { id: "3", label: "coco-2017-validation" },
  { id: "4", label: "open-images-v7" },
  { id: "5", label: "kitti-multiview" },
];

const EVENT_TYPES: ComboboxOption[] = [
  {
    id: "workflow.annotation_submitted",
    label: "workflow.annotation_submitted",
    description: "An annotator submitted a task",
  },
  {
    id: "workflow.review_submitted",
    label: "workflow.review_submitted",
    description: "A reviewer accepted or rejected a task",
  },
  { id: "op.executed", label: "op.executed", description: "An operator ran" },
  { id: "dataset.created", label: "dataset.created" },
];

/** Filtering belongs to the caller; a local list filters in the parent. */
function useFiltered(all: ComboboxOption[], query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((o) => o.label.toLowerCase().includes(q));
  }, [all, query]);
}

function Demo({
  all,
  ...args
}: { all: ComboboxOption[] } & Partial<ComponentProps<typeof Combobox>>) {
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<ComboboxOption | null>(null);
  const options = useFiltered(all, picked?.label === text ? "" : text);
  return (
    <div className="w-72">
      <Combobox
        options={options}
        value={picked}
        inputValue={text}
        onInputChange={setText}
        onChange={setPicked}
        {...args}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <Demo all={DATASETS} placeholder="All datasets" aria-label="Dataset" />
  ),
};

/** An open domain: the server takes any event type, so text commits. */
export const FreeText: Story = {
  render: () => (
    <Demo
      all={EVENT_TYPES}
      allowFreeText
      placeholder="All types"
      aria-label="Event type"
    />
  ),
};

export const Loading: Story = {
  render: () => <Demo all={[]} loading placeholder="Searching…" />,
};

export const Empty: Story = {
  render: () => (
    <Demo all={[]} emptyMessage="No matching datasets" placeholder="Search" />
  ),
};

export default meta;
