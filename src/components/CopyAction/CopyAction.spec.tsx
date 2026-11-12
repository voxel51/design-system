import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { CopyAction } from "./CopyAction";

describe("CopyAction", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("copies the text and shows it was copied", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = jest.fn();
    render(<CopyAction text="hello" onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument()
    );
    expect(writeText).toHaveBeenCalledWith("hello");
    expect(onCopy).toHaveBeenCalledWith("hello");
  });

  it("stays quiet when the clipboard refuses", async () => {
    const writeText = jest.fn().mockRejectedValue(new Error("denied"));
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = jest.fn();
    render(<CopyAction text="hello" onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(onCopy).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });
});
