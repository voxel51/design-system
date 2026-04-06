import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BaseSlider,
  MultiValueSlider,
  SingleValueSlider,
} from "@voxel51/voodo";
import React, { useState } from "react";

const meta: Meta<typeof BaseSlider> = {
  title: "Components/Slider",
  component: BaseSlider,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    min: {
      control: "number",
      description: "The minimum value for the slider",
    },
    max: {
      control: "number",
      description: "The maximum value for the slider",
    },
    step: {
      control: "number",
      description: "The step size for the slider",
    },
    multi: {
      control: "boolean",
      description: "Whether the slider has multiple knobs",
    },
    bare: {
      control: "boolean",
      description: "Whether to hide the value inputs",
    },
    labeled: {
      control: "boolean",
      description: "Whether to display labels for the slider endpoints",
    },
    knobLabel: {
      control: "boolean",
      description: "Whether to display labels for the slider knobs",
    },
    debounceDelay: {
      control: "number",
      description: "Delay in ms to apply debounce for onChange events",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
      </div>
    ),
  ],
};

type Story = StoryObj<typeof BaseSlider>;

const singleKnobProps = {
  args: {
    min: 0,
    max: 1,
    step: 0.01,
  },
  render: (props) => {
    const [value, setValue] = useState<number>(0.5);
    const onChange = (v) => {
      console.log(v);
      setValue(v);
    };

    return <SingleValueSlider value={value} onChange={onChange} {...props} />;
  },
};

const multiKnobProps = {
  args: {
    ...singleKnobProps.args,
  },
  render: (props) => {
    const [value, setValue] = useState<number[]>(() => [0.25, 0.75]);
    const onChange = (v) => {
      console.log(v);
      setValue(v);
    };

    return <MultiValueSlider value={value} onChange={onChange} {...props} />;
  },
};

export const Controlled: Story = {
  ...singleKnobProps,
  render: (props) => {
    const [value, setValue] = useState<number>(0.5);
    const onChange = (v) => {
      console.log(v);
      setValue(v);
    };

    return <BaseSlider value={value} onChange={onChange} {...props} />;
  },
};

export const MultipleKnobs: Story = {
  ...multiKnobProps,
};

export const WithSliderLabels: Story = {
  args: {
    ...singleKnobProps.args,
    labeled: true,
  },
  render: singleKnobProps.render,
};

export const WithInputLabels: Story = {
  args: {
    ...multiKnobProps.args,
    minLabel: "Min confidence",
    maxLabel: "Max confidence",
  },
  render: multiKnobProps.render,
};

export const WithAllLabels: Story = {
  args: {
    ...multiKnobProps.args,
    labeled: true,
    minLabel: "Min confidence",
    maxLabel: "Max confidence",
  },
  render: multiKnobProps.render,
};

export const Bare: Story = {
  args: {
    ...singleKnobProps.args,
    bare: true,
  },
  render: singleKnobProps.render,
};

export const Unset: Story = {
  args: {
    ...singleKnobProps.args,
    bare: true,
  },
  render: (props) => {
    const [value, setValue] = useState<number>();
    const onChange = (v) => {
      console.log(v);
      setValue(v);
    };

    return (
      <SingleValueSlider
        value={value}
        onChange={onChange}
        {...props}
        showUnsetHint
      />
    );
  },
};

export default meta;
