import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FileDropzone } from "./FileDropzone";

function makeDataTransfer(files: File[]): DataTransfer {
  return {
    files: files as unknown as FileList,
    items: files.map((file) => ({
      kind: "file",
      type: file.type,
      getAsFile: () => file,
    })) as unknown as DataTransferItemList,
    types: ["Files"],
  } as unknown as DataTransfer;
}

describe("FileDropzone", () => {
  it("should render with the default label", () => {
    render(<FileDropzone />);
    expect(screen.getByText("Drop files here")).toBeInTheDocument();
  });

  it("should render with a custom label", () => {
    render(<FileDropzone label="Drop images here" />);
    expect(screen.getByText("Drop images here")).toBeInTheDocument();
  });

  it("should render a description when provided", () => {
    render(<FileDropzone description="PNG or JPG up to 5 MB" />);
    expect(screen.getByText("PNG or JPG up to 5 MB")).toBeInTheDocument();
  });

  it("should render an error message when error prop is set", () => {
    render(<FileDropzone error="File is too large" />);
    expect(screen.getByText("File is too large")).toBeInTheDocument();
  });

  it("should be keyboard accessible with role=button", () => {
    render(<FileDropzone />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should have aria-disabled when disabled", () => {
    render(<FileDropzone disabled />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
  });

  it("should call onChange with dropped files", () => {
    const onChange = jest.fn();
    render(<FileDropzone onChange={onChange} />);

    const zone = screen.getByRole("button");
    const file = new File(["content"], "test.txt", { type: "text/plain" });

    fireEvent.dragOver(zone, { dataTransfer: makeDataTransfer([file]) });
    fireEvent.drop(zone, { dataTransfer: makeDataTransfer([file]) });

    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it("should not call onChange when disabled", () => {
    const onChange = jest.fn();
    render(<FileDropzone disabled onChange={onChange} />);

    const zone = screen.getByRole("button");
    const file = new File(["content"], "test.txt", { type: "text/plain" });

    fireEvent.drop(zone, { dataTransfer: makeDataTransfer([file]) });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should call onError when a file exceeds maxSize", () => {
    const onError = jest.fn();
    render(<FileDropzone maxSize={10} onError={onError} />);

    const zone = screen.getByRole("button");
    const file = new File(["this content is longer than 10 bytes"], "big.txt", {
      type: "text/plain",
    });

    fireEvent.drop(zone, { dataTransfer: makeDataTransfer([file]) });
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0]).toContain("too large");
  });

  it("should call onError when a file type is not accepted", () => {
    const onError = jest.fn();
    render(<FileDropzone accept="image/*" onError={onError} />);

    const zone = screen.getByRole("button");
    const file = new File(["hello"], "doc.pdf", { type: "application/pdf" });

    fireEvent.drop(zone, { dataTransfer: makeDataTransfer([file]) });
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0]).toContain("not accepted");
  });

  it("should only pass a single file when multiple is false", () => {
    const onChange = jest.fn();
    render(<FileDropzone multiple={false} onChange={onChange} />);

    const zone = screen.getByRole("button");
    const files = [
      new File(["a"], "a.txt", { type: "text/plain" }),
      new File(["b"], "b.txt", { type: "text/plain" }),
    ];

    fireEvent.drop(zone, { dataTransfer: makeDataTransfer(files) });
    expect(onChange).toHaveBeenCalledWith([files[0]]);
  });

  it("should open the file dialog when Enter is pressed", async () => {
    const user = userEvent.setup();
    render(<FileDropzone />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const clickSpy = jest.spyOn(input, "click");

    const zone = screen.getByRole("button");
    zone.focus();
    await user.keyboard("{Enter}");

    expect(clickSpy).toHaveBeenCalled();
  });

  it("should call onChange with files selected via dialog", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<FileDropzone onChange={onChange} />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    await user.upload(input, file);

    expect(onChange).toHaveBeenCalledWith([file]);
  });
});
