import { fireEvent, render, screen } from "@testing-library/react";

import { CodeBlock } from "./CodeBlock";

const CODE = 'import fiftyone as fo\n\nfo.load_dataset("quickstart")';

describe("CodeBlock", () => {
  it("should render the code", () => {
    render(<CodeBlock code={CODE} />);
    expect(screen.getByText("fiftyone", { exact: false })).toBeInTheDocument();
    expect(screen.getByTestId("code").textContent).toContain(
      'fo.load_dataset("quickstart")'
    );
  });

  it("should copy the code and show it was copied", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = jest.fn();
    render(<CodeBlock code={CODE} onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith(CODE);
    expect(
      await screen.findByRole("button", { name: "Copied" })
    ).toBeInTheDocument();
    expect(onCopy).toHaveBeenCalledWith(CODE);
  });

  it("should not show copied when the clipboard write fails", async () => {
    const writeText = jest.fn().mockRejectedValue(new Error("denied"));
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = jest.fn();
    render(<CodeBlock code={CODE} onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await Promise.resolve();
    await Promise.resolve();

    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(onCopy).not.toHaveBeenCalled();
  });

  it("should show given markup but copy the code", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(
      <CodeBlock code="raw">
        <mark>marked</mark>
      </CodeBlock>
    );

    expect(screen.getByText("marked").tagName).toBe("MARK");
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("raw");
    await screen.findByRole("button", { name: "Copied" });
  });

  it("should scroll long lines unless wrap is set", () => {
    const { rerender } = render(<CodeBlock code={CODE} />);
    const pre = screen.getByTestId("code").querySelector("pre");
    expect(pre).not.toHaveClass("whitespace-pre-wrap");

    rerender(<CodeBlock code={CODE} wrap />);
    expect(screen.getByTestId("code").querySelector("pre")).toHaveClass(
      "whitespace-pre-wrap",
      "break-words"
    );
  });
});
