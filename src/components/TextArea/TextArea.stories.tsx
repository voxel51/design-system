import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Button,
  FormField,
  Orientation,
  ResizeBehavior,
  Size,
  Spacing,
  Stack,
  TextArea,
} from "@voxel51/voodo";

import { withContainer } from "../../../stories/decorators/container";

const meta: Meta<typeof TextArea> = {
  title: "Components/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: Object.values(Size),
      description: "The size of the textarea",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
    },
    error: {
      control: "boolean",
      description: "Whether the textarea is in an error state",
    },
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
      description: "Resize behavior of the textarea",
    },
    rows: {
      control: "number",
      description: "Number of visible text rows",
    },
  },
  decorators: [withContainer()],
};

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextArea
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={args.placeholder || "Enter text..."}
        size={args.size || Size.Md}
      />
    );
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Enter a description...",
    size: Size.Md,
  },
};

export const WithError: Story = {
  args: {
    error: true,
    placeholder: "There's been a problem...",
    size: Size.Md,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "This textarea is disabled",
    disabled: true,
    size: Size.Md,
  },
};

export const DisabledWithValue: Story = {
  args: {
    value: "This content cannot be edited",
    disabled: true,
    size: Size.Md,
  },
};

export const Unset: Story = {
  args: {
    size: Size.Md,
    placeholder: "Enter text...",
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack orientation={Orientation.Column} spacing={Spacing.Md}>
      <TextArea placeholder="Extra small textarea" size={Size.Xs} />
      <TextArea placeholder="Small textarea" size={Size.Sm} />
      <TextArea placeholder="Medium textarea" size={Size.Md} />
      <TextArea placeholder="Large textarea" size={Size.Lg} />
    </Stack>
  ),
};

export const ResizeBehaviors: Story = {
  render: () => (
    <Stack orientation={Orientation.Column} spacing={Spacing.Md}>
      <TextArea
        placeholder="Resize Vertical (default) - Drag the bottom edge"
        resize={ResizeBehavior.Vertical}
      />
      <TextArea
        placeholder="Resize None - Cannot be resized"
        resize={ResizeBehavior.None}
      />
      <TextArea
        placeholder="Resize Horizontal - Drag the right edge"
        resize={ResizeBehavior.Horizontal}
      />
      <TextArea
        placeholder="Resize Both - Drag any corner"
        resize={ResizeBehavior.BiDirectional}
      />
    </Stack>
  ),
};

export const DifferentRows: Story = {
  render: () => (
    <Stack orientation={Orientation.Column} spacing={Spacing.Md}>
      <TextArea placeholder="This textarea has 3 rows (default)" rows={3} />
      <TextArea placeholder="This textarea has 5 rows" rows={5} />
      <TextArea placeholder="This textarea has 10 rows" rows={10} />
    </Stack>
  ),
};

export const WithValue: Story = {
  args: {
    value: "This textarea has a preset value",
    size: Size.Md,
  },
};

export const InteractiveForm: Story = {
  render: () => {
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
      if (feedback.length < 10) {
        setError("Feedback must be at least 10 characters");
      } else {
        setError("");
        alert(`Feedback submitted: ${feedback}`);
      }
    };

    return (
      <Stack orientation={Orientation.Column} spacing={Spacing.Md}>
        <FormField
          control={
            <TextArea
              placeholder="Tell us what you think... (minimum 10 characters)"
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                setError("");
              }}
              error={!!error}
              rows={5}
            />
          }
          label="Your feedback"
          error={error}
        />

        <Button onClick={handleSubmit}>Submit Feedback</Button>
      </Stack>
    );
  },
};

export default meta;
