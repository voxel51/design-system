import { render, screen } from "@testing-library/react";

import { UnsetHint } from "./UnsetHint";

const HINT = "Enter text to set a value";

describe("UnsetHint", () => {
  it("should render with unset hint", () => {
    render(<UnsetHint value={undefined} hint={HINT} />);
    expect(screen.getByText(HINT)).toBeInTheDocument();
  });

  it("should not render when value is set", () => {
    render(<UnsetHint value="some value" hint={HINT} />);
    expect(screen.queryByText(HINT)).not.toBeInTheDocument();
  });
});
