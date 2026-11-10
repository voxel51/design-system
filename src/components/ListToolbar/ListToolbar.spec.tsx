import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ListToolbar, type ListToolbarFilter } from "./ListToolbar";

const filters = (onChange = jest.fn(), value = "all"): ListToolbarFilter[] => [
  {
    id: "owner",
    label: "Owner",
    options: [
      { id: "all", label: "All" },
      { id: "mine", label: "Mine" },
    ],
    value,
    onChange,
  },
];

const setWidth = (width: number) =>
  jest
    .spyOn(HTMLElement.prototype, "offsetWidth", "get")
    .mockReturnValue(width);

describe("ListToolbar", () => {
  beforeAll(() => {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });
  afterEach(() => jest.restoreAllMocks());

  it("shows the count, search and one chip per filter when wide", () => {
    setWidth(600);
    render(
      <ListToolbar
        count="3 runs"
        search={{ value: "", onChange: jest.fn(), placeholder: "Search" }}
        filters={filters()}
      />
    );
    expect(screen.getByText("3 runs")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Owner" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Filters" })
    ).not.toBeInTheDocument();
  });

  it("folds the filters into one menu lit while one is set when narrow", async () => {
    setWidth(300);
    const onChange = jest.fn();
    render(<ListToolbar count="3 runs" filters={filters(onChange, "mine")} />);
    expect(
      screen.queryByRole("button", { name: "Owner" })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));
    await userEvent.click(await screen.findByText("All"));
    expect(onChange).toHaveBeenCalledWith("all");
  });

  it("shows the count inside the search field", () => {
    setWidth(700);
    render(
      <ListToolbar
        count="3/14 runs"
        search={{ value: "", onChange: jest.fn(), placeholder: "Search" }}
      />
    );
    const field = screen.getByPlaceholderText("Search").closest("div.border");
    expect(field).toContainElement(screen.getByText("3/14 runs"));
  });

  it("countPlacement start and end put the count outside the field", () => {
    setWidth(700);
    const { rerender } = render(
      <ListToolbar
        count="3 runs"
        countPlacement="start"
        search={{ value: "", onChange: jest.fn(), placeholder: "Search" }}
      />
    );
    const field = () =>
      screen.getByPlaceholderText("Search").closest("div.border");
    expect(field()).not.toContainElement(screen.getByText("3 runs"));
    expect(
      screen.getByText("3 runs").compareDocumentPosition(field() as Node)
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    rerender(
      <ListToolbar
        count="3 runs"
        countPlacement="end"
        search={{ value: "", onChange: jest.fn(), placeholder: "Search" }}
      />
    );
    expect(
      (field() as Node).compareDocumentPosition(screen.getByText("3 runs"))
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("narrowBelow 0 never folds the filters", () => {
    setWidth(200);
    render(<ListToolbar narrowBelow={0} filters={filters()} />);
    expect(screen.getByRole("button", { name: "Owner" })).toBeInTheDocument();
  });

  it("renders extra and actions in both layouts", () => {
    setWidth(300);
    render(<ListToolbar count="1" actions={<b>act</b>} extra={<i>more</i>} />);
    expect(screen.getByText("act")).toBeInTheDocument();
    expect(screen.getByText("more")).toBeInTheDocument();
  });
});
