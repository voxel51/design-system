import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { StepRail } from "./StepRail";

const steps = [
  { id: "source", label: "Source" },
  { id: "files", label: "Files" },
  { id: "import", label: "Import" },
];

describe("StepRail", () => {
  it("marks the current step and numbers the ones ahead", () => {
    render(<StepRail steps={steps} current="files" />);

    expect(screen.getByLabelText("Step 2 of 3")).toBeInTheDocument();
    expect(screen.getByText("Files").closest("[aria-current]")).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("lets completed steps be revisited", () => {
    const onSelect = jest.fn();
    render(<StepRail steps={steps} current="import" onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: "Files" }));
    expect(onSelect).toHaveBeenCalledWith("files");
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("keeps other steps' labels for assistive tech on a phone", () => {
    render(<StepRail steps={steps} current="files" />);

    expect(screen.getByText("Source")).toHaveClass("sr-only", "sm:not-sr-only");
    expect(screen.getByText("Files")).not.toHaveClass("sr-only");
  });

  it("names a step in a tooltip only while its label is hidden", async () => {
    render(<StepRail steps={steps} current="files" onSelect={jest.fn()} />);
    const source = screen.getByRole("button", { name: "Source" });

    await userEvent.hover(source);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await userEvent.unhover(source);

    screen.getByText("Source").style.position = "absolute";
    await userEvent.hover(source);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Source");
  });
});
