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

    expect(screen.getByText("Share")).toHaveClass("hidden", "lg:flex");
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("hides the label below 640px when it collapses at sm", () => {
    render(
      <TextAction collapse="sm" leadingIcon={IconName.Add} aria-label="Share">
        Share
      </TextAction>
    );

    expect(screen.getByText("Share")).toHaveClass("hidden", "sm:flex");
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
    expect(screen.getByText("Share")).not.toHaveClass("sm:flex");
    expect(screen.getByRole("button")).toHaveClass("px-2");
    expect(screen.getByRole("button")).not.toHaveClass("sm:px-4");
  });

  it("collapses with its row when auto, and names itself in a tooltip", () => {
    const { rerender } = render(
      <OverflowRowCompactContext.Provider value={false}>
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
      <OverflowRowCompactContext.Provider value={true}>
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

  it("sizes by token", () => {
    render(<TextAction size={Size.Sm}>Upgrade</TextAction>);

    expect(screen.getByRole("button")).toHaveClass("h-7", "text-body-tertiary");
  });
});
