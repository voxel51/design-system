import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { TagInput } from "./TagInput";

const Harness = ({
  initial = [],
  suggestions,
  onChange,
}: {
  initial?: string[];
  suggestions?: string[];
  onChange?: (tags: string[]) => void;
}) => {
  const [tags, setTags] = useState<string[]>(initial);
  const [draft, setDraft] = useState("");
  return (
    <TagInput
      aria-label="Tags"
      value={tags}
      onChange={(next) => {
        setTags(next);
        onChange?.(next);
      }}
      inputValue={draft}
      onInputChange={setDraft}
      suggestions={suggestions}
    />
  );
};

describe("TagInput", () => {
  it("commits the draft on Enter and comma, skipping duplicates", async () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    const field = screen.getByRole("combobox", { name: "Tags" });
    await userEvent.type(field, "demo{Enter}video,demo{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(["demo", "video"]);
    expect(field).toHaveValue("");
  });

  it("removes a tag by its button and the last one on Backspace", async () => {
    render(<Harness initial={["a", "b", "c"]} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove b" }));
    expect(screen.queryByText("b")).not.toBeInTheDocument();
    await userEvent.type(screen.getByRole("combobox"), "{Backspace}");
    expect(screen.queryByText("c")).not.toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
  });

  it("keeps tags when the frame or a tag is clicked, focusing the field", async () => {
    render(<Harness initial={["a", "b"]} />);
    await userEvent.click(screen.getByText("b"));
    await userEvent.click(
      screen.getByRole("combobox").closest("div[class*='flex-wrap']")!
    );
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("offers unpicked suggestions and clears the draft after a pick", async () => {
    const onChange = jest.fn();
    render(
      <Harness
        initial={["video"]}
        suggestions={["demo", "video"]}
        onChange={onChange}
      />
    );
    const field = screen.getByRole("combobox");
    await userEvent.type(field, "d");
    expect(screen.queryByRole("option", { name: "video" })).toBeNull();
    await userEvent.pointer({
      keys: "[MouseLeft>]",
      target: screen.getByRole("option", { name: "demo" }),
    });
    expect(onChange).toHaveBeenLastCalledWith(["video", "demo"]);
    expect(field).toHaveValue("");
  });
});
