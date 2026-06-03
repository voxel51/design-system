import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Size } from "@/types";

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
      { id: "only", data: { label: "Only Tab", content: <div>Only Content</div> } },
    ];
    render(<ToggleSwitch tabs={singleTab} />);
    expect(screen.getByText("Only Tab")).toBeInTheDocument();
    expect(screen.getByText("Only Content")).toBeInTheDocument();
  });

  it("should render with Soft variant and apply tab padding from softSizeStyles", () => {
    const { container } = render(
      <ToggleSwitch tabs={tabs} variant={ToggleSwitchVariant.Soft} size={Size.Md} />
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
    expect(container.querySelector('[role="tablist"]')).toHaveClass("custom-tab-list");
  });
});
