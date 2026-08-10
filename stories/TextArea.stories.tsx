import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  FormField,
  Orientation,
  Radius,
  Size,
  Spacing,
  Stack,
  TextArea,
} from "@voxel51/voodo";
import { useState } from "react";
import { withContainer } from "./decorators/container";

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
    radius: {
      control: "select",
      options: Object.values(Radius),
      description: "The border radius of the textarea",
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
        radius={args.radius || Radius.Sm}
      />
    );
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Enter a description...",
    size: Size.Md,
    radius: Radius.Sm,
  },
};

export const WithError: Story = {
  args: {
    error: true,
    placeholder: "There's been a problem...",
    size: Size.Md,
    radius: Radius.Sm,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "This textarea is disabled",
    disabled: true,
    size: Size.Md,
    radius: Radius.Sm,
  },
};

export const DisabledWithValue: Story = {
  args: {
    value: "This content cannot be edited",
    disabled: true,
    size: Size.Md,
    radius: Radius.Sm,
  },
};

export const Unset: Story = {
  args: {
    size: Size.Md,
    radius: Radius.Sm,
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
        resize="vertical"
      />
      <TextArea placeholder="Resize None - Cannot be resized" resize="none" />
      <TextArea
        placeholder="Resize Horizontal - Drag the right edge"
        resize="horizontal"
      />
      <TextArea placeholder="Resize Both - Drag any corner" resize="both" />
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

export const BorderRadii: Story = {
  render: () => (
    <Stack orientation={Orientation.Column} spacing={Spacing.Md}>
      <TextArea placeholder="No border radius" radius={Radius.None} />
      <TextArea placeholder="Small border radius" radius={Radius.Sm} />
      <TextArea placeholder="Medium border radius" radius={Radius.Md} />
      <TextArea placeholder="Large border radius" radius={Radius.Lg} />
      <TextArea placeholder="Full border radius" radius={Radius.Full} />
    </Stack>
  ),
};

export const WithValue: Story = {
  args: {
    value: "This textarea has a preset value",
    size: Size.Md,
    radius: Radius.Sm,
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
