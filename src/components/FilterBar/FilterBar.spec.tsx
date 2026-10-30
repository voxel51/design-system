import { render, screen } from "@testing-library/react";

import { FilterBar } from "./FilterBar";

const setWidth = (width: number) => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: /max-width/.test(query) && width < 1024,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
};

const bar = (
  <FilterBar search={<input aria-label="search" />} actions={<b>new</b>}>
    <span>filter</span>
  </FilterBar>
);

describe("FilterBar", () => {
  it("renders every slot on a wide screen", () => {
    setWidth(1440);
    render(bar);
    expect(screen.getByLabelText("search")).toBeInTheDocument();
    expect(screen.getByText("filter")).toBeInTheDocument();
    expect(screen.getByText("new")).toBeInTheDocument();
  });

  it("renders every slot on a narrow screen", () => {
    setWidth(390);
    render(bar);
    expect(screen.getByLabelText("search")).toBeInTheDocument();
    expect(screen.getByText("filter")).toBeInTheDocument();
    expect(screen.getByText("new")).toBeInTheDocument();
  });
});
