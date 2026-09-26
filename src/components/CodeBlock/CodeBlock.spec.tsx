import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { randomString } from "@/util/random";

import { CodeBlock } from "./CodeBlock";

const SOURCE = 'print("hello")\nprint("goodbye")';

describe("CodeBlock", () => {
  let testId: string;
  let writeText: jest.Mock;

  beforeEach(() => {
    testId = randomString();
    writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  it("should render the code", () => {
    render(<CodeBlock code={SOURCE} data-testid={testId} />);

    expect(screen.getByTestId(testId)).toHaveTextContent('print("hello")');
  });

  it("should render children in place of the code", () => {
    render(
      <CodeBlock code={SOURCE}>
        <span>marked up</span>
      </CodeBlock>
    );

    expect(screen.getByText("marked up")).toBeInTheDocument();
    expect(screen.queryByText(SOURCE)).not.toBeInTheDocument();
  });

  it("should copy the code rather than the markup", async () => {
    render(
      <CodeBlock code={SOURCE}>
        <span>marked up</span>
      </CodeBlock>
    );

    await userEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith(SOURCE);
  });

  it("should report a copy", async () => {
    render(<CodeBlock code={SOURCE} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(
      await screen.findByRole("button", { name: "Copied" })
    ).toBeInTheDocument();
  });

  it("should stay quiet when the clipboard refuses", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    render(<CodeBlock code={SOURCE} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("should number every line when asked", () => {
    render(<CodeBlock code={SOURCE} lineNumbers />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should not number lines by default", () => {
    render(<CodeBlock code={SOURCE} />);

    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("should withhold the copy control when it is not copyable", () => {
    render(<CodeBlock code={SOURCE} copyable={false} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
