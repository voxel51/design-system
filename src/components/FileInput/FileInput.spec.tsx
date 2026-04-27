import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FileInput } from "./FileInput";

describe("FileInput", () => {
  it("should render with the default label", () => {
    render(<FileInput />);
    expect(screen.getByText("Choose file")).toBeInTheDocument();
  });

  it("should render with a custom label", () => {
    render(<FileInput label="Upload image" />);
    expect(screen.getByText("Upload image")).toBeInTheDocument();
  });

  it("should show 'No file chosen' by default when showFileName is true", () => {
    render(<FileInput showFileName />);
    expect(screen.getByText("No file chosen")).toBeInTheDocument();
  });

  it("should not show file name when showFileName is false", () => {
    render(<FileInput showFileName={false} />);
    expect(screen.queryByText("No file chosen")).not.toBeInTheDocument();
  });

  it("should render a disabled button when disabled", () => {
    render(<FileInput disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should not fire onChange when disabled", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<FileInput disabled onChange={onChange} />);
    await user.click(screen.getByRole("button"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should call onChange with selected files", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<FileInput onChange={onChange} data-testid="fi" />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    await user.upload(input, file);

    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it("should call onChange with multiple files when multiple is true", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<FileInput multiple onChange={onChange} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [
      new File(["a"], "a.txt", { type: "text/plain" }),
      new File(["b"], "b.txt", { type: "text/plain" }),
    ];
    await user.upload(input, files);

    expect(onChange).toHaveBeenCalledWith(files);
  });

  it("should pass through additional props", () => {
    render(<FileInput data-testid="file-input-test" />);
    expect(screen.getByTestId("file-input-test")).toBeInTheDocument();
  });
});
