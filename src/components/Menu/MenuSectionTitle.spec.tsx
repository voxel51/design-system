import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown, DropdownTrigger } from "@/components/Dropdown";

import { MenuSectionTitle } from "./MenuSectionTitle";

const trigger = <DropdownTrigger>Open menu</DropdownTrigger>;

describe("MenuSectionTitle", () => {
  it("should render its label", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuSectionTitle>My Section</MenuSectionTitle>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByText("My Section")).toBeInTheDocument();
  });

  it("should expose role=presentation so it is skipped by menu navigation", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuSectionTitle>Section</MenuSectionTitle>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  it("should pass className through to the root", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuSectionTitle className="custom-title">Section</MenuSectionTitle>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByRole("presentation")).toHaveClass("custom-title");
  });
});
