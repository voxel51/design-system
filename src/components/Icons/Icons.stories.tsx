import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { Clickable, Icon, IconName, Size, TextColor } from "@voxel51/voodo";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: Object.values(IconName),
      description: "The icon name",
    },
    size: {
      control: "select",
      options: [Size.Sm, Size.Md, Size.Lg],
      description: "The size of the icon",
    },
    color: {
      control: "color",
      description: "The color of the icon",
      defaultValue: "var(--color-content-text-primary)",
    },
  },
};

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: IconName.Check,
    size: Size.Md,
    color: TextColor.Primary,
  },
};

export const AllIcons: Story = {
  render: () => {
    const iconNames = Object.values(IconName) as IconName[];
    const sizes: Size[] = [Size.Sm, Size.Md, Size.Lg];

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "24px",
          padding: "24px",
          color: "var(--color-content-text-primary)",
        }}
      >
        <div style={{ fontWeight: "bold", textAlign: "center" }}>Icon Name</div>
        <div style={{ fontWeight: "bold", textAlign: "center" }}>Small</div>
        <div style={{ fontWeight: "bold", textAlign: "center" }}>Medium</div>
        <div style={{ fontWeight: "bold", textAlign: "center" }}>Large</div>
        <div style={{ fontWeight: "bold", textAlign: "center" }}>Container</div>

        {iconNames.map((iconName) => (
          <React.Fragment key={iconName}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "500",
              }}
            >
              {iconName}
            </div>
            {sizes.map((size) => (
              <div
                key={`${iconName}-${size}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
              >
                <Icon name={iconName} size={size} />
              </div>
            ))}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clickable className="flex items-center justify-center w-1/4">
                <Icon name={iconName} />
              </Clickable>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
