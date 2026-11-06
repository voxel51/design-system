import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { MarkdownEditor } from "./MarkdownEditor";

const Harness = ({ initial = "" }: { initial?: string }) => {
  const [value, setValue] = useState(initial);
  return (
    <MarkdownEditor
      value={value}
      onChange={setValue}
      renderPreview={(text) => (
        <p data-testid="preview">{text.toUpperCase()}</p>
      )}
      placeholder="Write here"
    />
  );
};

describe("MarkdownEditor", () => {
  it("edits on the Write tab", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByPlaceholderText("Write here"), "hello");
    expect(screen.getByRole("textbox")).toHaveValue("hello");
  });

  it("renders the preview and keeps the text when switching back", async () => {
    const user = userEvent.setup();
    render(<Harness initial="note" />);
    await user.click(screen.getByText("Preview"));
    expect(screen.getByTestId("preview")).toHaveTextContent("NOTE");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    await user.click(screen.getByText("Write"));
    expect(screen.getByRole("textbox")).toHaveValue("note");
  });

  it("shows the empty message when there is nothing to preview", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByText("Preview"));
    expect(screen.getByText("Nothing to preview")).toBeInTheDocument();
  });

  it("does not edit when disabled", () => {
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
        renderPreview={() => null}
        disabled
      />
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
