import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import { AddIcon } from "@/components/Icons";
import { Variant } from "@/types";

import { Button } from "./Button";

const DummyIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
      />
    </svg>
  );
};

describe("Button", () => {
  const buttonText = "click me";

  // Regression: `Variant.Borderless` used `action-primary-text` for its hover
  // text and `bg-card-elevated` for its hover fill. Both are white-on-white in
  // the light theme -- `action.primary.text` is `neutral[0]` in both themes
  // (it is the colour for text ON a filled primary button) and light's
  // `card-elevated` is the same `neutral[0]` as `card-1` -- so the button
  // vanished on hover. It looked correct in dark, so only a class assertion
  // catches it.
  describe("Variant.Borderless hover", () => {
    const classesOf = () =>
      `${screen.getByRole("button").className} ${
        screen.getByRole("button").firstElementChild?.className ?? ""
      }`;

    it("should not use on-fill text colour for hover text", () => {
      render(<Button variant={Variant.Borderless}>{buttonText}</Button>);
      expect(classesOf()).not.toContain("action-primary-text");
    });

    it("should use primary text and a fill distinct from card-1 on hover", () => {
      render(<Button variant={Variant.Borderless}>{buttonText}</Button>);
      const classes = classesOf();
      expect(classes).toContain(
        "hover:text-[var(--color-content-text-primary)]"
      );
      expect(classes).toContain("hover:bg-[var(--color-content-bg-card-2)]");
      expect(classes).not.toContain("bg-card-elevated");
    });
  });

  it("should render with text", () => {
    render(<Button>{buttonText}</Button>);
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  it("should render with an FC leading icon", () => {
    render(<Button leadingIcon={DummyIcon}>{buttonText}</Button>);

    expect(screen.getByText(buttonText)).toBeInTheDocument();
    const innerHtml = screen.getByRole("button").innerHTML;
    expect(innerHtml).toContain("<svg");
    expect(innerHtml.indexOf("<svg")).toBeLessThan(
      innerHtml.indexOf(buttonText)
    );
  });

  it("should render with a string leading icon", () => {
    render(<Button leadingIcon={AddIcon}>{buttonText}</Button>);

    expect(screen.getByText(buttonText)).toBeInTheDocument();
    const innerHtml = screen.getByRole("button").innerHTML;
    expect(innerHtml).toContain("<svg");
    expect(innerHtml.indexOf("<svg")).toBeLessThan(
      innerHtml.indexOf(buttonText)
    );
  });

  it("should render with an FC trailing icon", () => {
    render(<Button trailingIcon={DummyIcon}>{buttonText}</Button>);

    expect(screen.getByText(buttonText)).toBeInTheDocument();
    const innerHtml = screen.getByRole("button").innerHTML;
    expect(innerHtml).toContain("<svg");
    expect(innerHtml.indexOf("<svg")).toBeGreaterThan(
      innerHtml.indexOf(buttonText)
    );
  });

  it("should render with a string trailing icon", () => {
    render(<Button trailingIcon={AddIcon}>{buttonText}</Button>);

    expect(screen.getByText(buttonText)).toBeInTheDocument();
    const innerHtml = screen.getByRole("button").innerHTML;
    expect(innerHtml).toContain("<svg");
    expect(innerHtml.indexOf("<svg")).toBeGreaterThan(
      innerHtml.indexOf(buttonText)
    );
  });

  describe("onClick", () => {
    let onClick: jest.Func;
    let user: UserEvent;

    beforeEach(() => {
      onClick = jest.fn();
      user = userEvent.setup();
    });

    it("should fire when clicked", async () => {
      render(<Button onClick={onClick}></Button>);
      const button = screen.getByRole("button");

      await user.click(button);
      expect(onClick).toHaveBeenCalled();
    });

    it("should not fire when disabled", async () => {
      render(<Button onClick={onClick} disabled></Button>);
      const button = screen.getByRole("button");

      await user.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it("should render an anchor with the button's look when href is set", () => {
    render(
      <Button href="https://docs.voxel51.com" target="_blank">
        Docs
      </Button>
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "https://docs.voxel51.com");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render a disabled button, not a link, when href is set and disabled", () => {
    render(
      <Button href="https://docs.voxel51.com" disabled>
        Docs
      </Button>
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Docs" })).toBeDisabled();
  });
});
