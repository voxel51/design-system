import { render, screen } from "@testing-library/react";

import { MetaList } from "./MetaList";

describe("MetaList", () => {
  it("separates the facts and skips empty ones", () => {
    const { container } = render(
      <MetaList>
        <span>One</span>
        {false}
        <span>Two</span>
      </MetaList>
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  it("keeps the facts on one line, cut with an ellipsis, when truncate is set", () => {
    render(
      <MetaList truncate>
        <span>One</span>
        <span>Two</span>
      </MetaList>
    );
    const line = screen.getByText("One").closest(".truncate");
    expect(line).toHaveTextContent("One·Two");
    expect(line).not.toHaveClass("flex");
    expect(screen.getByText("·")).toHaveClass("mx-2");
  });
});
