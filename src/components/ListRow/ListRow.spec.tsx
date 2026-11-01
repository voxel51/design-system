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

  it("blocks the click of a disabled row but keeps its actions", async () => {
    const onClick = jest.fn();
    const onUnpin = jest.fn();
    render(
      <ListRow
        title="Locked"
        disabled
        onClick={onClick}
        actions={
          <button type="button" onClick={onUnpin}>
            Unpin
          </button>
        }
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /Locked/ }));
    await userEvent.click(screen.getByRole("button", { name: "Unpin" }));
    expect(onClick).not.toHaveBeenCalled();
    expect(onUnpin).toHaveBeenCalledTimes(1);
  });

  it("draws an active row in its hover surface", () => {
    const { container } = render(<ListRow title="Highlighted" active />);
    expect(container.firstChild).toHaveClass("bg-content-bg-card");
  });
});
