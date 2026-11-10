import { fireEvent, render, screen } from "@testing-library/react";

import { Dropzone } from "./Dropzone";

const file = new File(["x"], "a.png", { type: "image/png" });

describe("Dropzone", () => {
  it("hands over dropped and picked files", () => {
    const onFiles = jest.fn();
    const { container } = render(
      <Dropzone title="Drop files" description="or browse" onFiles={onFiles} />
    );

    fireEvent.drop(screen.getByRole("button"), {
      dataTransfer: { files: [file] },
    });
    fireEvent.change(container.querySelector("input")!, {
      target: { files: [file] },
    });

    expect(onFiles).toHaveBeenNthCalledWith(1, [file]);
    expect(onFiles).toHaveBeenNthCalledWith(2, [file]);
    expect(screen.getByText("or browse")).toBeInTheDocument();
  });

  it("marks a drag in progress and ignores drops while disabled", () => {
    const onFiles = jest.fn();
    const { rerender } = render(<Dropzone title="Drop" onFiles={onFiles} />);
    const zone = screen.getByRole("button");

    fireEvent.dragEnter(zone);
    expect(zone).toHaveAttribute("data-dragging", "true");

    rerender(<Dropzone title="Drop" onFiles={onFiles} disabled />);
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFiles).not.toHaveBeenCalled();
  });

  it("stays highlighted while the drag crosses its children", () => {
    render(
      <Dropzone title="Drop" description="or browse" onFiles={jest.fn()} />
    );
    const zone = screen.getByRole("button");
    const child = screen.getByText("or browse");
    fireEvent.dragEnter(zone);
    fireEvent.dragEnter(child);
    fireEvent.dragLeave(zone);
    expect(zone).toHaveAttribute("data-dragging", "true");
    fireEvent.dragLeave(child);
    expect(zone).not.toHaveAttribute("data-dragging");
  });
});
