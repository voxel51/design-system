import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, RadioGroup, Size } from "@voxel51/voodo";
import React, { useState } from "react";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Radio",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: [Size.Sm, Size.Md, Size.Lg],
      description: "The size of the radio button",
    },
    label: {
      control: "text",
      description: "The label text for the radio button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the radio button is disabled",
    },
  },
};

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: (args) => {
    return (
      <RadioGroup
        options={[{ value: "option1", label: args.label || "Radio label" }]}
        value="option1"
        onChange={() => {}}
        disabled={args.disabled || false}
        size={args.size || Size.Md}
        defaultValue={args.defaultValue || "option1"}
        name={args.name || "radio-group"}
        className={args.className || ""}
        radioProps={args.radioProps || {}}
      />
    );
  },
};

export const RadioGroupSizes: Story = {
  render: () => {
    const [value, setValue] = useState("option2");
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ];
    return (
      <div className="flex flex-col gap-8">
        <div>
          <div className="mb-2 text-sm text-gray-600">Small</div>
          <RadioGroup
            options={options}
            size={Size.Sm}
            value={value}
            onChange={setValue}
          />
        </div>
        <div>
          <div className="mb-2 text-sm text-gray-600">Medium</div>
          <RadioGroup
            options={options}
            size={Size.Md}
            value={value}
            onChange={setValue}
          />
        </div>
        <div>
          <div className="mb-2 text-sm text-gray-600">Large</div>
          <RadioGroup
            options={options}
            size={Size.Lg}
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
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
        size={Size.Md}
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
        size={Size.Md}
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
        size={Size.Md}
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
        size={Size.Md}
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
        size={Size.Md}
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
        size={Size.Md}
      />
    );
  },
};

export default meta;
