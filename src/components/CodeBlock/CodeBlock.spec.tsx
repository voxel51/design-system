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

  it("should copy the code and show it was copied", () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = jest.fn();
    render(<CodeBlock code={CODE} onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith(CODE);
    expect(onCopy).toHaveBeenCalledWith(CODE);
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("should show given markup but copy the code", () => {
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
  });
});
