import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Size } from "@/types";
import { OverflowRowCompactContext } from "@/util/compact";

import { ToggleSwitch, ToggleSwitchVariant } from "./ToggleSwitch";

describe("ToggleSwitch", () => {
  const tabs = [
    { id: "tab-1", data: { label: "Tab 1", content: <div>Content 1</div> } },
    { id: "tab-2", data: { label: "Tab 2", content: <div>Content 2</div> } },
    { id: "tab-3", data: { label: "Tab 3", content: <div>Content 3</div> } },
  ];

  it("should render with tabs", () => {
    render(<ToggleSwitch tabs={tabs} />);

    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
  });

  it("draws the voodo focus ring on a keyboard-focused tab", () => {
    render(<ToggleSwitch tabs={tabs} />);
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).toHaveClass("focus-visible:outline-content-focus-ring");
      expect(tab).not.toHaveClass("outline-none");
    }
  });

  it("should render the first tab content by default", () => {
    render(<ToggleSwitch tabs={tabs} />);

    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Content 3")).not.toBeInTheDocument();
  });

  it("should switch to different tab content when clicked", async () => {
    const user = userEvent.setup();
    render(<ToggleSwitch tabs={tabs} />);

    const tab2 = screen.getByText("Tab 2");
    await user.click(tab2);

    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Content 3")).not.toBeInTheDocument();
  });

  it("should render with defaultIndex", () => {
    render(<ToggleSwitch tabs={tabs} defaultIndex={1} />);

    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  it("should render the controlled tab when index is provided", () => {
    render(<ToggleSwitch tabs={tabs} index={2} />);

    expect(screen.getByText("Content 3")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  it("should reflect a controlled index change from the parent", () => {
    const { rerender } = render(<ToggleSwitch tabs={tabs} index={0} />);
    expect(screen.getByText("Content 1")).toBeInTheDocument();

    // an external update (not a user click) must move the active tab
    rerender(<ToggleSwitch tabs={tabs} index={1} />);
    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  it("should let a controlled index override defaultIndex", () => {
    render(<ToggleSwitch tabs={tabs} defaultIndex={0} index={2} />);

    expect(screen.getByText("Content 3")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  it("shows no tab as active at index -1, keeping one focusable", () => {
    render(
      <ToggleSwitch tabs={tabs} variant={ToggleSwitchVariant.Soft} index={-1} />
    );
    const all = screen.getAllByRole("tab");
    for (const tab of all) {
      expect(tab.className).not.toContain("data-selected:bg-");
      expect(tab.className).toContain("!text-content-text-secondary");
    }
    expect(all.filter((tab) => tab.tabIndex === 0)).toHaveLength(1);
    for (const tab of all) {
      expect(tab).toHaveAttribute("aria-selected", "false");
    }
  });

  it("keeps link tabs as links at index -1", () => {
    render(
      <ToggleSwitch
        index={-1}
        tabs={[{ id: "a", data: { label: "A", href: "/a" } }]}
      />
    );
    const tab = screen.getByRole("tab", { name: "A" });
    expect(tab.tagName).toBe("A");
    expect(tab).toHaveAttribute("href", "/a");
    expect(tab).toHaveAttribute("aria-selected", "false");
  });

  it("should pass through additional props", () => {
    render(
      <ToggleSwitch
        tabs={tabs}
        data-testid="toggle-component"
        id="test-toggle"
      />
    );

    const toggle = screen.getByTestId("toggle-component");
    expect(toggle).toHaveAttribute("id", "test-toggle");
  });

  it("should apply soft styles when variant is soft", () => {
    const { container } = render(
      <ToggleSwitch tabs={tabs} variant={ToggleSwitchVariant.Soft} />
    );

    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toBeInTheDocument();
    expect(tabList).toHaveClass("w-fit");
    expect(tabList).not.toHaveClass("w-full");
  });

  it("should default to fit width", () => {
    const { container } = render(<ToggleSwitch tabs={tabs} />);

    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toBeInTheDocument();
    expect(tabList).toHaveClass("w-fit");
    expect(tabList).not.toHaveClass("w-full");
  });

  it("should be full width when specified", () => {
    const { container } = render(<ToggleSwitch tabs={tabs} fullWidth />);

    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toBeInTheDocument();
    expect(tabList).toHaveClass("w-full");
    expect(tabList).not.toHaveClass("w-fit");
  });

  it("should render a single tab (isFirst and isLast both true)", () => {
    const singleTab = [
      {
        id: "only",
        data: { label: "Only Tab", content: <div>Only Content</div> },
      },
    ];
    render(<ToggleSwitch tabs={singleTab} />);
    expect(screen.getByText("Only Tab")).toBeInTheDocument();
    expect(screen.getByText("Only Content")).toBeInTheDocument();
  });

  it("should render with Soft variant and apply tab padding from softSizeStyles", () => {
    const { container } = render(
      <ToggleSwitch
        tabs={tabs}
        variant={ToggleSwitchVariant.Soft}
        size={Size.Md}
      />
    );
    const tabButtons = container.querySelectorAll('[role="tab"]');
    expect(tabButtons.length).toBe(3);
  });

  it("should render with Full variant", () => {
    const { container } = render(
      <ToggleSwitch tabs={tabs} variant={ToggleSwitchVariant.Full} />
    );
    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toBeInTheDocument();
  });

  it("should render with Borderless variant", () => {
    const { container } = render(
      <ToggleSwitch tabs={tabs} variant={ToggleSwitchVariant.Borderless} />
    );
    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toBeInTheDocument();
  });

  it("should call onChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<ToggleSwitch tabs={tabs} onChange={handleChange} />);
    await user.click(screen.getByText("Tab 2"));
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("should apply tabListClassName to the tab list", () => {
    const { container } = render(
      <ToggleSwitch tabs={tabs} tabListClassName="custom-tab-list" />
    );
    expect(container.querySelector('[role="tablist"]')).toHaveClass(
      "custom-tab-list"
    );
  });

  it("should render tabs with an href as links without panels", () => {
    render(
      <ToggleSwitch
        index={1}
        tabs={[
          { id: "a", data: { label: "A", href: "/a" } },
          { id: "b", data: { label: "B", href: "/b" } },
        ]}
      />
    );

    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute(
      "href",
      "/b"
    );
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  });

  it("should render a disabled tab with an href as a button", () => {
    render(
      <ToggleSwitch
        tabs={[
          { id: "a", data: { label: "A", href: "/a" } },
          { id: "b", data: { label: "B", href: "/b", disabled: true } },
        ]}
      />
    );

    expect(screen.getByRole("tab", { name: "B" })).not.toHaveAttribute("href");
  });
});

describe("ToggleSwitch icon tabs", () => {
  const Glyph = () => <svg data-testid="glyph" />;
  const iconTabs = [
    { id: "chart", data: { label: "Chart", icon: Glyph } },
    { id: "table", data: { label: "Table", icon: Glyph } },
  ];

  it("shows each tab's icon before its label", () => {
    render(<ToggleSwitch tabs={iconTabs} />);
    expect(screen.getAllByTestId("glyph")).toHaveLength(2);
    expect(screen.getByRole("tab", { name: "Chart" })).toHaveTextContent(
      "Chart"
    );
  });

  it("names an icon-only tab by its label", () => {
    render(<ToggleSwitch tabs={iconTabs} collapse="always" />);
    const tab = screen.getByRole("tab", { name: "Chart" });
    expect(tab).not.toHaveTextContent("Chart");
    expect(tab).toHaveAttribute("aria-label", "Chart");
  });

  it("drops labels while the enclosing row is compact", () => {
    render(
      <OverflowRowCompactContext.Provider
        value={{ compact: true, labelMax: null }}
      >
        <ToggleSwitch tabs={iconTabs} collapse="auto" />
      </OverflowRowCompactContext.Provider>
    );
    expect(screen.getByRole("tab", { name: "Table" })).not.toHaveTextContent(
      "Table"
    );
  });

  it("renders no tab panel when every tab's content is null", () => {
    render(
      <ToggleSwitch
        tabs={[
          { id: "a", data: { label: "A", content: null } },
          { id: "b", data: { label: "B", content: null } },
        ]}
      />
    );
    expect(screen.queryByRole("tabpanel")).toBeNull();
  });
});
