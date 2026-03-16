import { render, screen } from "@testing-library/react";

import { IconName } from "@/types";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("should render with icon and title", () => {
    render(<EmptyState icon={IconName.Draw} title="Example Title" />);
    expect(screen.getByText("Example Title")).toBeInTheDocument();
  });

  it("should render with icon, title, and description", () => {
    render(
      <EmptyState
        icon={IconName.Draw}
        title="Example Title"
        description="This is an example description."
      />
    );
    expect(screen.getByText("Example Title")).toBeInTheDocument();
    expect(
      screen.getByText("This is an example description.")
    ).toBeInTheDocument();
  });
});
