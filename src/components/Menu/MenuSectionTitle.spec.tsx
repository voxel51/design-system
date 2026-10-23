import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown, DropdownTrigger } from "@/components/Dropdown";
import { TextColor, TextVariant } from "@/types";

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
    await screen.findByRole("menu");
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
    await screen.findByRole("menu");
    expect(
      within(screen.getByRole("menu")).getByRole("presentation")
    ).toBeInTheDocument();
  });

  it("should pass className through to the root", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuSectionTitle className="custom-title">Section</MenuSectionTitle>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    await screen.findByRole("menu");
    expect(
      within(screen.getByRole("menu")).getByRole("presentation")
    ).toHaveClass("custom-title");
  });

  it("should apply textVariant and textColor to the title", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuSectionTitle
          textVariant={TextVariant.BodyTertiary}
          textColor={TextColor.Primary}
        >
          Section
        </MenuSectionTitle>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    await screen.findByRole("menu");
    const title = screen.getByText("Section");
    expect(title).toHaveClass("text-body-tertiary");
    expect(title).toHaveClass("text-content-text-primary");
    expect(title).not.toHaveClass("uppercase");
  });
});
