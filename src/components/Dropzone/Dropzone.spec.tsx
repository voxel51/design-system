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

    fireEvent.dragOver(zone);
    expect(zone).toHaveAttribute("data-dragging", "true");

    rerender(<Dropzone title="Drop" onFiles={onFiles} disabled />);
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFiles).not.toHaveBeenCalled();
  });
});
