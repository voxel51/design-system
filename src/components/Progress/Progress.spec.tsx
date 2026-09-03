import { render, screen } from "@testing-library/react";

import { Progress } from "./Progress";

describe("Progress", () => {
  it("should render with role progressbar", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should report the percent of max as aria-valuenow", () => {
    render(<Progress value={25} max={50} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50"
    );
  });

  it("should clamp values above max to 100%", () => {
    render(<Progress value={150} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );
  });

  it("should clamp negative values to 0%", () => {
    render(<Progress value={-10} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
  });

  it("should treat a zero or negative max as empty rather than dividing by zero", () => {
    render(<Progress value={10} max={0} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
  });

  it("should pass through additional props to the component", () => {
    render(<Progress value={50} data-testid="custom-progress" />);
    expect(screen.getByTestId("custom-progress")).toBeInTheDocument();
  });

  it("should apply an aria-label when provided", () => {
    render(<Progress value={50} aria-label="Voxel tokens used" />);
    expect(
      screen.getByRole("progressbar", { name: "Voxel tokens used" })
    ).toBeInTheDocument();
  });
});
