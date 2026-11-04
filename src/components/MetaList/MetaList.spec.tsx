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
});
