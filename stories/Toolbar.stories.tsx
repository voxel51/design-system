import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Icon,
  IconName,
  Orientation,
  Size,
  Toolbar,
  ToolbarAction,
  ToolbarGroup,
} from "@voxel51/voodo";
import React, { useState } from "react";

const toolbarActionIconClass = "text-[var(--toolbar-action-icon-color)]";

const meta: Meta<typeof Toolbar> = {
  title: "Components/Toolbar",
  component: Toolbar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: Object.values(Orientation),
      description: "Layout direction for groups and actions",
    },
    lockX: {
      control: "boolean",
      description: "Lock horizontal (x-axis) movement",
    },
    lockY: {
      control: "boolean",
      description: "Lock vertical (y-axis) movement",
    },
    xOffset: {
      control: "number",
      description: "Initial pixel offset from the left edge of the parent",
    },
    yOffset: {
      control: "number",
      description: "Initial pixel offset from the top edge of the parent",
    },
    zIndex: {
      control: "number",
      description: "CSS z-index",
    },
    visible: {
      control: "boolean",
      description: "Whether the toolbar is rendered",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

/**
 * Wraps a toolbar in a bounded container so the absolute-positioned toolbar
 * has a real parent to drag within.
 */
const ToolbarStageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: "relative", width: "100%", height: "400px" }}>
    {children}
  </div>
);

/**
 * Default vertical toolbar with two groups and interactive active-state toggling.
 * Click any action to activate it; click again to deactivate.
 */
export const Default: Story = {
  render: (args) => {
    const [activeTool, setActiveTool] = useState<string | null>("move");

    const toggle = (tool: string) =>
      setActiveTool((prev) => (prev === tool ? null : tool));

    return (
      <ToolbarStageWrapper>
        <Toolbar {...args} aria-label="Drawing tools">
          <ToolbarGroup aria-label="Transform">
            <ToolbarAction
              active={activeTool === "move"}
              onClick={() => toggle("move")}
              aria-label="Move"
              title="Move"
            >
              <Icon
                name={IconName.Move}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
            <ToolbarAction
              active={activeTool === "inspect"}
              onClick={() => toggle("inspect")}
              aria-label="Inspect"
              title="Inspect"
            >
              <Icon
                name={IconName.Inspect}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
          </ToolbarGroup>
          <ToolbarGroup aria-label="Draw">
            <ToolbarAction
              active={activeTool === "draw"}
              onClick={() => toggle("draw")}
              aria-label="Draw"
              title="Draw"
            >
              <Icon
                name={IconName.Draw}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
            <ToolbarAction
              active={activeTool === "polyline"}
              onClick={() => toggle("polyline")}
              aria-label="Polyline"
              title="Polyline"
            >
              <Icon
                name={IconName.Polyline}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
          </ToolbarGroup>
        </Toolbar>
      </ToolbarStageWrapper>
    );
  },
  args: {
    orientation: Orientation.Column,
    xOffset: 20,
    yOffset: 20,
  },
};

/**
 * Horizontal orientation. The drag handle rotates to match the axis, and group
 * dividers become vertical rules between groups.
 */
export const Horizontal: Story = {
  render: (args) => {
    const [activeTool, setActiveTool] = useState<string | null>("move");

    const toggle = (tool: string) =>
      setActiveTool((prev) => (prev === tool ? null : tool));

    return (
      <ToolbarStageWrapper>
        <Toolbar {...args} aria-label="Drawing tools">
          <ToolbarGroup aria-label="Transform">
            <ToolbarAction
              active={activeTool === "move"}
              onClick={() => toggle("move")}
              aria-label="Move"
              title="Move"
            >
              <Icon
                name={IconName.Move}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
            <ToolbarAction
              active={activeTool === "inspect"}
              onClick={() => toggle("inspect")}
              aria-label="Inspect"
              title="Inspect"
            >
              <Icon
                name={IconName.Inspect}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
          </ToolbarGroup>
          <ToolbarGroup aria-label="Draw">
            <ToolbarAction
              active={activeTool === "draw"}
              onClick={() => toggle("draw")}
              aria-label="Draw"
              title="Draw"
            >
              <Icon
                name={IconName.Draw}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
            <ToolbarAction
              active={activeTool === "polyline"}
              onClick={() => toggle("polyline")}
              aria-label="Polyline"
              title="Polyline"
            >
              <Icon
                name={IconName.Polyline}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
          </ToolbarGroup>
        </Toolbar>
      </ToolbarStageWrapper>
    );
  },
  args: {
    orientation: Orientation.Row,
    xOffset: 20,
    yOffset: 20,
  },
};

/**
 * Three groups separated by automatic dividers. The last group's divider is
 * hidden automatically — no manual configuration required.
 */
export const MultipleGroups: Story = {
  render: (args) => {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const toggle = (tool: string) =>
      setActiveTool((prev) => (prev === tool ? null : tool));

    return (
      <ToolbarStageWrapper>
        <Toolbar {...args} aria-label="Full tool palette">
          <ToolbarGroup aria-label="Select">
            <ToolbarAction
              active={activeTool === "move"}
              onClick={() => toggle("move")}
              aria-label="Move"
              title="Move"
            >
              <Icon
                name={IconName.Move}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
          </ToolbarGroup>
          <ToolbarGroup aria-label="Annotate">
            <ToolbarAction
              active={activeTool === "draw"}
              onClick={() => toggle("draw")}
              aria-label="Draw"
              title="Draw"
            >
              <Icon
                name={IconName.Draw}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
            <ToolbarAction
              active={activeTool === "polyline"}
              onClick={() => toggle("polyline")}
              aria-label="Polyline"
              title="Polyline"
            >
              <Icon
                name={IconName.Polyline}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
            <ToolbarAction
              active={activeTool === "detection"}
              onClick={() => toggle("detection")}
              aria-label="Detection"
              title="Detection"
            >
              <Icon
                name={IconName.Detection}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
          </ToolbarGroup>
          <ToolbarGroup aria-label="View">
            <ToolbarAction
              active={activeTool === "inspect"}
              onClick={() => toggle("inspect")}
              aria-label="Inspect"
              title="Inspect"
            >
              <Icon
                name={IconName.Inspect}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
            <ToolbarAction
              active={activeTool === "fullscreen"}
              onClick={() => toggle("fullscreen")}
              aria-label="Fullscreen"
              title="Fullscreen"
            >
              <Icon
                name={IconName.Fullscreen}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
          </ToolbarGroup>
        </Toolbar>
      </ToolbarStageWrapper>
    );
  },
  args: {
    orientation: Orientation.Column,
    xOffset: 20,
    yOffset: 20,
  },
};

/**
 * A `ToolbarAction` with `disabled={true}` renders at 50% opacity with a
 * `not-allowed` cursor and does not respond to clicks.
 */
export const DisabledAction: Story = {
  render: (args) => {
    const [activeTool, setActiveTool] = useState<string | null>("move");

    return (
      <ToolbarStageWrapper>
        <Toolbar {...args} aria-label="Disabled action demo">
          <ToolbarGroup aria-label="Tools">
            <ToolbarAction
              active={activeTool === "move"}
              onClick={() => setActiveTool("move")}
              aria-label="Move"
              title="Move (active)"
            >
              <Icon
                name={IconName.Move}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
            <ToolbarAction
              disabled
              aria-label="Draw (disabled)"
              title="Draw (disabled)"
            >
              <Icon
                name={IconName.Draw}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
            <ToolbarAction
              active={activeTool === "polyline"}
              onClick={() => setActiveTool("polyline")}
              aria-label="Polyline"
              title="Polyline"
            >
              <Icon
                name={IconName.Polyline}
                size={Size.Xl}
                className={toolbarActionIconClass}
              />
            </ToolbarAction>
          </ToolbarGroup>
        </Toolbar>
      </ToolbarStageWrapper>
    );
  },
  args: {
    orientation: Orientation.Column,
    xOffset: 20,
    yOffset: 20,
  },
};

/**
 * When both `lockX` and `lockY` are true the drag handle is hidden entirely,
 * producing a pinned toolbar that cannot be repositioned.
 */
export const LockedPosition: Story = {
  render: (args) => (
    <ToolbarStageWrapper>
      <Toolbar {...args} aria-label="Locked toolbar">
        <ToolbarGroup aria-label="Tools">
          <ToolbarAction aria-label="Settings" title="Settings">
            <Icon
              name={IconName.Settings}
              size={Size.Xl}
              className={toolbarActionIconClass}
            />
          </ToolbarAction>
          <ToolbarAction aria-label="Search" title="Search">
            <Icon
              name={IconName.Search}
              size={Size.Xl}
              className={toolbarActionIconClass}
            />
          </ToolbarAction>
        </ToolbarGroup>
      </Toolbar>
    </ToolbarStageWrapper>
  ),
  args: {
    orientation: Orientation.Column,
    lockX: true,
    lockY: true,
    xOffset: 20,
    yOffset: 20,
  },
};

/**
 * `visible={false}` renders nothing. Use this prop to mount/unmount the toolbar
 * based on application state without losing its last position.
 */
export const NotVisible: Story = {
  render: (args) => (
    <ToolbarStageWrapper>
      <p
        style={{
          padding: "1rem",
          opacity: 0.5,
          fontFamily: "sans-serif",
          fontSize: "0.875rem",
        }}
      >
        The toolbar is hidden (visible=false). Toggle "visible" in the controls
        panel to show it.
      </p>
      <Toolbar {...args} aria-label="Hidden toolbar">
        <ToolbarGroup aria-label="Tools">
          <ToolbarAction aria-label="Move" title="Move">
            <Icon
              name={IconName.Move}
              className="text-[var(--toolbar-action-icon-color)]"
            />
          </ToolbarAction>
        </ToolbarGroup>
      </Toolbar>
    </ToolbarStageWrapper>
  ),
  args: {
    orientation: Orientation.Column,
    visible: false,
    xOffset: 20,
    yOffset: 20,
  },
};
