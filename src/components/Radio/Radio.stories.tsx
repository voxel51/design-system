import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { RadioGroup } from "@voxel51/voodo";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Radio",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the radio button is disabled",
    },
  },
};

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => {
    return (
      <RadioGroup
        options={[{ value: "option1", label: "Radio label" }]}
        value="option1"
        onChange={() => {}}
        disabled={args.disabled || false}
        defaultValue={args.defaultValue || "option1"}
        name={args.name || "radio-group"}
        className={args.className || ""}
        radioProps={args.radioProps || {}}
      />
    );
  },
};

export const Checked: Story = {
  render: () => {
    return (
      <RadioGroup
        options={[{ value: "option1", label: "Checked radio" }]}
        value="option1"
        onChange={() => {}}
      />
    );
  },
};

export const Unchecked: Story = {
  render: () => {
    return (
      <RadioGroup
        options={[{ value: "option1", label: "Unchecked radio" }]}
        value=""
        onChange={() => {}}
      />
    );
  },
};

export const Unset: Story = {
  render: () => {
    return (
      <RadioGroup
        options={[{ value: "option1", label: "Unset radio" }]}
        value={undefined}
        onChange={() => {}}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <RadioGroup
        options={[{ value: "option1", label: "Disabled radio" }]}
        value=""
        onChange={() => {}}
        disabled
      />
    );
  },
};

export const DisabledChecked: Story = {
  render: () => {
    return (
      <RadioGroup
        options={[{ value: "option1", label: "Disabled checked radio" }]}
        value="option1"
        onChange={() => {}}
        disabled
      />
    );
  },
};

export const RadioGroupHorizontal: Story = {
  render: () => {
    const [value, setValue] = useState("option1");
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ];
    return (
      <RadioGroup
        options={options}
        value={value}
        onChange={setValue}
        className="flex flex-row gap-6"
      />
    );
  },
};

export const RadioGroupWithOneDisabled: Story = {
  render: () => {
    const [value, setValue] = useState("option1");
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2", disabled: true },
      { value: "option3", label: "Option 3" },
    ];
    return <RadioGroup options={options} value={value} onChange={setValue} />;
  },
};

export const RadioGroupAllDisabled: Story = {
  render: () => {
    const [value, setValue] = useState("option1");
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ];
    return (
      <RadioGroup
        options={options}
        value={value}
        onChange={setValue}
        disabled
      />
    );
  },
};

export const WithoutLabel: Story = {
  render: () => {
    const [value, setValue] = useState("option1");
    return (
      <RadioGroup
        options={[{ value: "option1", label: "" }]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export default meta;
