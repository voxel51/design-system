import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination, type PaginationProps } from "./Pagination";

const setup = (props: Partial<PaginationProps> = {}) => {
  const onPageChange = jest.fn();
  render(
    <Pagination
      page={5}
      pageCount={20}
      onPageChange={onPageChange}
      {...props}
    />
  );
  return { onPageChange };
};

describe("Pagination", () => {
  it("renders nothing for a single page without a size select", () => {
    const { container } = render(
      <Pagination page={1} pageCount={1} onPageChange={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current page", () => {
    setup();
    expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("goes to a page, next, previous, first and last", async () => {
    const user = userEvent.setup();
    const { onPageChange } = setup();
    await user.click(screen.getByRole("button", { name: "Page 6" }));
    await user.click(screen.getByTestId("go-to-next-page"));
    await user.click(screen.getByTestId("go-to-previous-page"));
    await user.click(screen.getByTestId("go-to-first-page"));
    await user.click(screen.getByTestId("go-to-last-page"));
    expect(onPageChange.mock.calls.map(([p]: [number]) => p)).toEqual([
      6, 6, 4, 1, 20,
    ]);
  });

  it("disables first and previous on the first page", () => {
    setup({ page: 1 });
    expect(screen.getByTestId("go-to-first-page")).toBeDisabled();
    expect(screen.getByTestId("go-to-previous-page")).toBeDisabled();
    expect(screen.getByTestId("go-to-next-page")).toBeEnabled();
  });

  it("jumps to a typed page on Enter and clamps it", async () => {
    const user = userEvent.setup();
    const { onPageChange } = setup();
    const input = screen.getByLabelText("Go to page");
    await user.clear(input);
    await user.type(input, "99{Enter}");
    expect(onPageChange).toHaveBeenCalledWith(20);
  });

  it("hides the jump field when every page is visible", () => {
    setup({ pageCount: 5 });
    expect(screen.queryByLabelText("Go to page")).not.toBeInTheDocument();
  });

  it("shows the range summary with a total", () => {
    setup({ page: 2, pageSize: 25, total: 312 });
    expect(screen.getByRole("navigation")).toHaveTextContent("26–50 of 312");
  });

  it("falls back to page of count without a total", () => {
    setup();
    expect(screen.getByRole("navigation")).toHaveTextContent("Page 5 of 20");
  });

  it("disables every control", () => {
    setup({ disabled: true });
    expect(screen.getByTestId("go-to-next-page")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Page 6" })).toBeDisabled();
  });

  it("hides the summary, jump and edge buttons on request", () => {
    setup({ hide: ["summary", "jump", "edges"] });
    expect(screen.queryByText("Page 5 of 20")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Go to page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("go-to-first-page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("go-to-last-page")).not.toBeInTheDocument();
    expect(screen.getByTestId("go-to-next-page")).toBeInTheDocument();
  });

  it("hides numbered pages but keeps previous and next", () => {
    setup({ hide: ["pages"] });
    expect(
      screen.queryByRole("button", { name: "Page 6" })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("go-to-previous-page")).toBeInTheDocument();
  });

  it("hides the page-size select", () => {
    setup({
      pageSize: 25,
      onPageSizeChange: jest.fn(),
      hide: ["page-size"],
    });
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("centers its contents", () => {
    setup({ align: "center" });
    expect(screen.getByRole("navigation")).toHaveClass("justify-center");
  });

  it("jumps from a clickable ellipsis", async () => {
    const user = userEvent.setup();
    const { onPageChange } = setup({ jump: "ellipsis" });
    expect(screen.queryByLabelText("Go to page")).not.toBeInTheDocument();
    await user.click(
      screen.getAllByRole("button", { name: "Jump to page" })[0]
    );
    await user.type(screen.getByLabelText("Go to page"), "12{Enter}");
    expect(onPageChange).toHaveBeenCalledWith(12);
  });

  it("cancels the ellipsis field on Escape", async () => {
    const user = userEvent.setup();
    const { onPageChange } = setup({ jump: "ellipsis" });
    await user.click(
      screen.getAllByRole("button", { name: "Jump to page" })[0]
    );
    await user.type(screen.getByLabelText("Go to page"), "12{Escape}");
    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.queryByLabelText("Go to page")).not.toBeInTheDocument();
  });

  it("offers both the field and the ellipsis", () => {
    setup({ jump: "both" });
    expect(screen.getByLabelText("Go to page")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Jump to page" }).length
    ).toBeGreaterThan(0);
  });
});
