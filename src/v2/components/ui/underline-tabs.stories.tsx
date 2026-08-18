import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { CountPill, UnderlineTab, UnderlineTabs } from "@voxel51/voodo/v2";

/**
 * Page-level tab bar with a sliding underline indicator. Used across settings
 * and detail pages.
 *
 * Unlike `Tabs`, this is presentation only — it does not own panel state.
 * The caller tracks the active tab and renders the body, which suits tabs
 * backed by routes.
 */
const meta: Meta<typeof UnderlineTabs> = {
  title: "v2/Components/UnderlineTabs",
  component: UnderlineTabs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof UnderlineTabs>;

export const Default: Story = {
  render: function DefaultStory() {
    const [active, setActive] = React.useState("overview");
    const tabs = ["overview", "logs", "config"];
    return (
      <UnderlineTabs>
        {tabs.map((t) => (
          <UnderlineTab
            key={t}
            active={active === t}
            onClick={() => setActive(t)}
            className="capitalize"
          >
            {t}
          </UnderlineTab>
        ))}
      </UnderlineTabs>
    );
  },
};

/** Counts sit inside the tab, so the indicator measures the whole label. */
export const WithCounts: Story = {
  render: function WithCountsStory() {
    const [active, setActive] = React.useState("all");
    const tabs = [
      { id: "all", label: "All", count: 12 },
      { id: "builtin", label: "Built-in", count: 9 },
      { id: "custom", label: "Custom", count: 3 },
    ];
    return (
      <UnderlineTabs>
        {tabs.map((t) => (
          <UnderlineTab key={t.id} active={active === t.id} onClick={() => setActive(t.id)}>
            {t.label}
            <CountPill count={t.count} size="sm" />
          </UnderlineTab>
        ))}
      </UnderlineTabs>
    );
  },
};
