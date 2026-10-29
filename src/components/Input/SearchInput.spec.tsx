import { fireEvent, render, screen } from "@testing-library/react";

import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("reports typed text and clears it", () => {
    const onChange = jest.fn();
    render(
      <SearchInput value="abc" onChange={onChange} placeholder="Search" />
    );
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "abcd" },
    });
    expect(onChange).toHaveBeenCalledWith("abcd", expect.anything());
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("shows the active scope", () => {
    render(
      <SearchInput
        value=""
        onChange={jest.fn()}
        scopes={[
          { id: "all", label: "All" },
          { id: "name", label: "Name" },
        ]}
        scope="name"
      />
    );
    expect(screen.getByLabelText("Search scope")).toHaveTextContent("Name");
  });
});
