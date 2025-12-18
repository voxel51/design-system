import { Size } from "@/types";
import { render, screen } from "@testing-library/react";
import { InputError } from "./InputError";

describe("InputError", () => {
  it("should render the error message", () => {
    render(<InputError error="This field is required" size={Size.Md} />);
    const error = screen.getByText("This field is required");
    expect(error).toBeInTheDocument();
  });

  it("should apply destructive color class", () => {
    render(<InputError error="Error message" size={Size.Md} />);
    const error = screen.getByText("Error message");
    expect(error.className).toContain("text-semantic-destructive");
  });

  it("should apply size styles", () => {
    render(<InputError error="Error message" size={Size.Sm} />);
    const error = screen.getByText("Error message");
    expect(error.className).toContain("text-sm/6");
  });
});
