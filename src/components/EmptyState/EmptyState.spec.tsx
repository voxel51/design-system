import { fireEvent, render, screen } from "@testing-library/react";

import { DrawIcon } from "@/components/Icons";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("should render with icon and title", () => {
    render(<EmptyState icon={DrawIcon} title="Example Title" />);
    expect(screen.getByText("Example Title")).toBeInTheDocument();
  });

  it("should render with icon, title, and description", () => {
    render(
      <EmptyState
        icon={DrawIcon}
        title="Example Title"
        description="This is an example description."
      />
    );
    expect(screen.getByText("Example Title")).toBeInTheDocument();
    expect(
      screen.getByText("This is an example description.")
    ).toBeInTheDocument();
  });

  it("should render a primary action button and call onAction when clicked", () => {
    const onAction = jest.fn();
    render(
      <EmptyState
        icon={DrawIcon}
        title="Example Title"
        actionLabel="Create"
        onAction={onAction}
      />
    );
    const button = screen.getByRole("button", { name: "Create" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("should render custom actions", () => {
    render(
      <EmptyState
        icon={DrawIcon}
        title="Example Title"
        actions={<button>Custom Action</button>}
      />
    );
    expect(
      screen.getByRole("button", { name: "Custom Action" })
    ).toBeInTheDocument();
  });
});
