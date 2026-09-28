import { fireEvent, render, screen } from "@testing-library/react";

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
});
