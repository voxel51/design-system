import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  const tabs = [
    { id: "tab-1", data: { label: "Tab 1", content: <div>Content 1</div> } },
    { id: "tab-2", data: { label: "Tab 2", content: <div>Content 2</div> } },
    { id: "tab-3", data: { label: "Tab 3", content: <div>Content 3</div> } },
  ];

  it("should render with tabs", () => {
    render(<Toggle tabs={tabs} />);

    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
  });

  it("should render the first tab content by default", () => {
    render(<Toggle tabs={tabs} />);

    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Content 3")).not.toBeInTheDocument();
  });

  it("should switch to different tab content when clicked", async () => {
    const user = userEvent.setup();
    render(<Toggle tabs={tabs} />);

    const tab2 = screen.getByText("Tab 2");
    await user.click(tab2);

    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Content 3")).not.toBeInTheDocument();
  });

  it("should render with defaultIndex", () => {
    render(<Toggle tabs={tabs} defaultIndex={1} />);

    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  it("should pass through additional props", () => {
    render(
      <Toggle tabs={tabs} data-testid="toggle-component" id="test-toggle" />
    );

    const toggle = screen.getByTestId("toggle-component");
    expect(toggle).toHaveAttribute("id", "test-toggle");
  });

  it("should apply default styles when soft is false", () => {
    const { container } = render(<Toggle tabs={tabs} soft={false} />);

    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toBeInTheDocument();
    expect(tabList).toHaveClass("w-full");
    expect(tabList).not.toHaveClass("w-fit");
  });

  it("should apply soft styles when soft is true", () => {
    const { container } = render(<Toggle tabs={tabs} soft={true} />);

    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toBeInTheDocument();
    expect(tabList).toHaveClass("w-fit");
    expect(tabList).not.toHaveClass("w-full");
  });

  it("should default to soft=false when soft prop is not provided", () => {
    const { container } = render(<Toggle tabs={tabs} />);

    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toBeInTheDocument();
    expect(tabList).toHaveClass("w-full");
    expect(tabList).not.toHaveClass("w-fit");
  });
});
