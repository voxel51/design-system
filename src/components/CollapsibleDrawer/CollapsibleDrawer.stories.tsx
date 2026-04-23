import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ThemeProvider from "../ThemeProvider";
import CollapsibleDrawer from "./CollapsibleDrawer";

const withTheme = (Story: React.FC) => (
  <ThemeProvider>
    <Story />
  </ThemeProvider>
);

const meta: Meta<typeof CollapsibleDrawer> = {
  title: "Components/CollapsibleDrawer",
  component: CollapsibleDrawer,
  decorators: [withTheme],
  argTypes: {
    label: { control: "text" },
    defaultOpen: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof CollapsibleDrawer>;

export const Default: Story = {
  args: {
    label: "Messages",
    defaultOpen: true,
    children: (
      <div style={{ padding: "12px", fontSize: "0.8rem" }}>
        Drawer content goes here.
      </div>
    ),
  },
};

export const InitiallyClosed: Story = {
  args: {
    label: "Messages",
    defaultOpen: false,
    children: (
      <div style={{ padding: "12px", fontSize: "0.8rem" }}>
        Drawer content goes here.
      </div>
    ),
  },
};

export const NoLabel: Story = {
  args: {
    defaultOpen: true,
    children: (
      <div style={{ padding: "12px", fontSize: "0.8rem" }}>
        Drawer with no label — just a chevron toggle.
      </div>
    ),
  },
};

export const TallContent: Story = {
  args: {
    label: "Lanes",
    defaultOpen: true,
    children: (
      <div style={{ padding: "12px" }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            style={{
              height: "24px",
              display: "flex",
              alignItems: "center",
              fontSize: "0.75rem",
              borderBottom: "1px solid var(--fo-palette-divider)",
            }}
          >
            /topic/channel_{i}
          </div>
        ))}
      </div>
    ),
  },
};

export const Stacked: Story = {
  render: (args) => (
    <ThemeProvider>
      <div style={{ width: 400, display: "flex", flexDirection: "column", gap: 2 }}>
        <CollapsibleDrawer label="Camera" defaultOpen>
          <div style={{ padding: "8px", fontSize: "0.75rem" }}>Camera lane content</div>
        </CollapsibleDrawer>
        <CollapsibleDrawer label="LiDAR" defaultOpen={false}>
          <div style={{ padding: "8px", fontSize: "0.75rem" }}>LiDAR lane content</div>
        </CollapsibleDrawer>
        <CollapsibleDrawer label="IMU" defaultOpen>
          <div style={{ padding: "8px", fontSize: "0.75rem" }}>IMU lane content</div>
        </CollapsibleDrawer>
      </div>
    </ThemeProvider>
  ),
};
