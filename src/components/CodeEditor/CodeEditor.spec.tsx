import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CodeEditor } from "./CodeEditor";

jest.mock("@monaco-editor/react", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    options,
  }: {
    value?: string;
    onChange?: (value?: string) => void;
    options?: { readOnly?: boolean };
  }) => (
    <textarea
      className="monaco-editor"
      aria-label="code"
      value={value}
      readOnly={options?.readOnly}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

describe("CodeEditor", () => {
  it("renders the value once Monaco loads", async () => {
    render(<CodeEditor value='{"a": 1}' />);

    expect(await screen.findByLabelText("code")).toHaveValue('{"a": 1}');
  });

  it("reports edits as text", async () => {
    const onChange = jest.fn();
    render(<CodeEditor value="" onChange={onChange} />);

    await userEvent.type(await screen.findByLabelText("code"), "x");

    expect(onChange).toHaveBeenLastCalledWith("x");
  });

  it("passes readOnly to Monaco", async () => {
    render(<CodeEditor value="{}" readOnly />);

    expect(await screen.findByLabelText("code")).toHaveAttribute("readonly");
  });

  it("frames the editor at the given height", () => {
    render(<CodeEditor value="{}" height={240} data-testid="frame" />);

    expect(screen.getByTestId("frame")).toHaveStyle({ height: "240px" });
  });
});
