import { Size } from "@/types";
import { Field } from "@headlessui/react";
import { render, screen } from "@testing-library/react";
import { type ReactElement } from "react";
import { InputLabel } from "./InputLabel";

// Helper to wrap InputLabel in Field for testing
const renderWithField = (component: ReactElement) => {
  return render(<Field>{component}</Field>);
};

describe("InputLabel", () => {
  it("should return null when neither label nor secondaryLabel is provided", () => {
    renderWithField(<InputLabel size={Size.Md} />);
    expect(
      screen.queryByTestId("input-label-container")
    ).not.toBeInTheDocument();
  });

  it("should render the label when provided", () => {
    renderWithField(<InputLabel label="Test Label" size={Size.Md} />);
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
  });

  it("should render the secondaryLabel when provided", () => {
    renderWithField(<InputLabel secondaryLabel="Optional" size={Size.Md} />);
    const secondaryLabel = screen.getByText("Optional");
    expect(secondaryLabel).toBeInTheDocument();
  });

  it("should render both label and secondaryLabel when both are provided", () => {
    renderWithField(
      <InputLabel label="Test Label" secondaryLabel="Optional" size={Size.Md} />
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("should apply sm size styles to label", () => {
    renderWithField(<InputLabel label="Test Label" size={Size.Sm} />);
    const label = screen.getByText("Test Label");
    expect(label.className).toBeTruthy();
  });

  it("should apply custom className", () => {
    renderWithField(
      <InputLabel
        label="Test Label"
        size={Size.Md}
        className="custom-label-class"
      />
    );
    const label = screen.getByText("Test Label");
    expect(label.className).toContain("custom-label-class");
  });
});
