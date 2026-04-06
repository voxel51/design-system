import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker, Size } from "@voxel51/voodo";
import React, { useState } from "react";
import { withContainer } from "../../stories/decorators/container";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [withContainer()],
};

type Story = StoryObj<typeof DatePicker>;

export const DateOnly: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | null>(new Date());
    const handleChange = (date: Date | null) => {
      setSelected(date);
    };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          height: "300px",
        }}
      >
        <DatePicker selected={selected} onChange={handleChange} />
      </div>
    );
  },
};

export const Datetime: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | null>(new Date());
    const handleChange = (date: Date | null) => {
      setSelected(date);
    };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          height: "300px",
        }}
      >
        <DatePicker
          selected={selected}
          onChange={handleChange}
          showTimeSelect
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <DatePicker size={Size.Sm} placeholderText="Small date picker" />
      <DatePicker size={Size.Md} placeholderText="Medium date picker" />
      <DatePicker size={Size.Lg} placeholderText="Large date picker" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    selected: new Date("2024-01-15"),
    placeholderText: "Select a date",
  },
};

export const Errored: Story = {
  args: {
    error: true,
    placeholderText: "Select a date",
  },
};

export const MinMaxDate: Story = {
  render: () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start of day 7 days ago

    const [selected, setSelected] = useState<Date | null>(null);
    const handleChange = (date: Date | null) => {
      setSelected(date);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          height: "300px",
        }}
      >
        <DatePicker
          selected={selected}
          onChange={handleChange}
          minDate={sevenDaysAgo}
          maxDate={today}
          placeholderText="Select a date (7 days ago to today)"
        />
      </div>
    );
  },
};

export default meta;
