import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ListRow } from "./ListRow";

describe("ListRow", () => {
  it("renders a link with title and subtitle when given href", () => {
    render(<ListRow href="/runs/1" title="Run" subtitle="Dataset · now" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/runs/1");
    expect(link).toHaveTextContent("Run");
    expect(link).toHaveTextContent("Dataset · now");
  });

  it("renders a button that calls onClick without href", async () => {
    const onClick = jest.fn();
    render(<ListRow title="View" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: /View/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("keeps actions outside the clickable part", () => {
    render(
      <ListRow
        href="/d"
        title="Dataset"
        actions={<button type="button">Unpin</button>}
      />
    );
    expect(screen.getByRole("link")).not.toContainElement(
      screen.getByRole("button", { name: "Unpin" })
    );
  });
});
