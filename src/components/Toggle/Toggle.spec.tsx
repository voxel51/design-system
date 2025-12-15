import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  const tabs = [
    { label: "Tab 1", content: <div>Content 1</div> },
    { label: "Tab 2", content: <div>Content 2</div> },
    { label: "Tab 3", content: <div>Content 3</div> },
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
});
