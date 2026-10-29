import { fireEvent, render, screen } from "@testing-library/react";

import { IconName, Size } from "@/types";
import { OverflowRowCompactContext } from "@/util/compact";

import { TextAction } from "./TextAction";

describe("TextAction", () => {
  it("renders its label and icon as one button", () => {
    const onClick = jest.fn();
    render(
      <TextAction trailingIcon={IconName.ArrowUpRight} onClick={onClick}>
        Upgrade
      </TextAction>
    );

    const button = screen.getByRole("button", { name: "Upgrade" });
    expect(button.querySelector("svg")).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("keeps its fill while pressed", () => {
    render(<TextAction aria-pressed>Wrap</TextAction>);

    expect(screen.getByRole("button", { name: "Wrap" })).toHaveClass(
      "aria-pressed:bg-content-interactive-secondary-hover",
      "aria-pressed:text-content-text-primary"
    );
  });

  it("colors a danger tone as a failure", () => {
    render(<TextAction tone="danger">Stop import</TextAction>);

    expect(screen.getByRole("button")).toHaveClass("text-content-text-failure");
  });

  it("hides the label below 1024px when it collapses", () => {
    render(
      <TextAction collapse leadingIcon={IconName.Add} aria-label="Share">
        Share
      </TextAction>
    );

    expect(screen.getByText("Share")).toHaveClass("hidden", "lg:inline-block");
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("hides the label below 640px when it collapses at sm", () => {
    render(
      <TextAction collapse="sm" leadingIcon={IconName.Add} aria-label="Share">
        Share
      </TextAction>
    );

    expect(screen.getByText("Share")).toHaveClass("hidden", "sm:inline-block");
    expect(screen.getByRole("button")).toHaveClass("px-2", "sm:px-4");
  });

  it("hides the label at every width when it always collapses", () => {
    render(
      <TextAction
        collapse="always"
        leadingIcon={IconName.Add}
        aria-label="Share"
      >
        Share
      </TextAction>
    );

    expect(screen.getByText("Share")).toHaveClass("hidden");
    expect(screen.getByText("Share")).not.toHaveClass("sm:inline-block");
    expect(screen.getByRole("button")).toHaveClass("px-2");
    expect(screen.getByRole("button")).not.toHaveClass("sm:px-4");
  });

  it("collapses with its row when auto, and names itself in a tooltip", () => {
    const { rerender } = render(
      <OverflowRowCompactContext.Provider
        value={{ compact: false, labelMax: null }}
      >
        <TextAction
          collapse="auto"
          leadingIcon={IconName.Add}
          aria-label="Share"
          hint="Locked"
        >
          Share
        </TextAction>
      </OverflowRowCompactContext.Provider>
    );
    expect(screen.getByText("Share")).not.toHaveClass("hidden");

    rerender(
      <OverflowRowCompactContext.Provider
        value={{ compact: true, labelMax: null }}
      >
        <TextAction
          collapse="auto"
          leadingIcon={IconName.Add}
          aria-label="Share"
          hint="Locked"
        >
          Share
        </TextAction>
      </OverflowRowCompactContext.Provider>
    );
    expect(screen.getByText("Share")).toHaveClass("hidden");
    fireEvent.mouseEnter(screen.getByRole("button").parentElement as Element);
    expect(screen.getByRole("tooltip")).toHaveTextContent("ShareLocked");
  });

  it("names itself in its tooltip below its collapse breakpoint", () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === "(max-width: 639.98px)",
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    render(
      <TextAction
        collapse="sm"
        leadingIcon={IconName.Add}
        aria-label="Share"
        hint="Locked"
      >
        Share
      </TextAction>
    );
    fireEvent.mouseEnter(screen.getByRole("button").parentElement as Element);
    expect(screen.getByRole("tooltip")).toHaveTextContent("ShareLocked");
    window.matchMedia = matchMedia;
  });

  it("cuts its label to the row's width before collapsing", () => {
    render(
      <OverflowRowCompactContext.Provider
        value={{ compact: false, labelMax: 48 }}
      >
        <TextAction
          collapse="auto"
          leadingIcon={IconName.Add}
          aria-label="Share"
        >
          Share with the team
        </TextAction>
      </OverflowRowCompactContext.Provider>
    );
    const label = screen.getByText("Share with the team");
    expect(label).not.toHaveClass("hidden");
    expect(label).toHaveClass("truncate");
    expect(label).toHaveStyle({ maxWidth: "48px" });
  });

  it("names a cut label in its tooltip", () => {
    render(
      <OverflowRowCompactContext.Provider
        value={{ compact: false, labelMax: 48 }}
      >
        <TextAction
          collapse="auto"
          leadingIcon={IconName.Add}
          aria-label="Share"
        >
          Share with the team
        </TextAction>
      </OverflowRowCompactContext.Provider>
    );
    const label = screen.getByText("Share with the team");
    Object.defineProperty(label, "scrollWidth", { value: 120 });
    Object.defineProperty(label, "clientWidth", { value: 48 });
    fireEvent.mouseOver(screen.getByRole("button"));
    fireEvent.mouseEnter(screen.getByRole("button").parentElement as Element);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Share");
  });

  it("sizes by token", () => {
    render(<TextAction size={Size.Sm}>Upgrade</TextAction>);

    expect(screen.getByRole("button")).toHaveClass("h-7", "text-body-tertiary");
  });
});
