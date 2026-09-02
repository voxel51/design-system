import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { useState } from "react";

import { Combobox, type ComboboxOption } from "./Combobox";

const OPTIONS: ComboboxOption[] = [
  { id: "a", label: "alpha", description: "the first one" },
  { id: "b", label: "beta" },
  { id: "c", label: "gamma" },
];

/** Harness that owns the controlled text + selection, as a caller would. */
function Harness({
  onPick,
  ...props
}: {
  onPick?: (o: ComboboxOption | null) => void;
} & Partial<ComponentProps<typeof Combobox>>) {
  const [text, setText] = useState("");
  const [value, setValue] = useState<ComboboxOption | null>(null);
  return (
    <Combobox
      options={OPTIONS}
      value={value}
      inputValue={text}
      onInputChange={setText}
      onChange={(o) => {
        setValue(o);
        onPick?.(o);
      }}
      aria-label="Thing"
      {...props}
    />
  );
}

describe("Combobox", () => {
  it("opens the list on focus and renders every option", async () => {
    render(<Harness />);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("renders an option's description", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByText("the first one")).toBeInTheDocument();
  });

  it("picks an option on click and fills the field", async () => {
    const onPick = jest.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("beta"));

    expect(onPick).toHaveBeenCalledWith(OPTIONS[1]);
    expect(screen.getByRole("combobox")).toHaveValue("beta");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("moves the highlight with the arrows and picks with Enter", async () => {
    const onPick = jest.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.click(screen.getByRole("combobox"));
    // Nothing is highlighted until the user arrows: the first ArrowDown lands
    // on the first row, so two land on the second.
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(onPick).toHaveBeenCalledWith(OPTIONS[1]);
  });

  it("arrows up from nothing onto the last row, and wraps", async () => {
    const onPick = jest.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("{ArrowUp}{ArrowUp}{ArrowDown}{Enter}");

    expect(onPick).toHaveBeenCalledWith(OPTIONS[2]);
  });

  it("closes on Escape without picking", async () => {
    const onPick = jest.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onPick).not.toHaveBeenCalled();
  });

  it("drops the selection once the text no longer matches it", async () => {
    const onPick = jest.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("beta"));
    onPick.mockClear();
    await userEvent.type(screen.getByRole("combobox"), "x");

    expect(onPick).toHaveBeenCalledWith(null);
  });

  it("ignores unmatched text when free text is not allowed", async () => {
    const onPick = jest.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.type(screen.getByRole("combobox"), "nope");
    await userEvent.tab();

    expect(onPick).not.toHaveBeenCalled();
  });

  it("commits unmatched text on blur when free text is allowed", async () => {
    const onPick = jest.fn();
    render(<Harness allowFreeText onPick={onPick} />);
    await userEvent.type(screen.getByRole("combobox"), "op.custom");
    await userEvent.tab();

    expect(onPick).toHaveBeenCalledWith({
      id: "op.custom",
      label: "op.custom",
    });
  });

  it("leaves unmatched text uncommitted on blur when commitOnBlur is off", async () => {
    const onPick = jest.fn();
    render(<Harness allowFreeText commitOnBlur={false} onPick={onPick} />);
    await userEvent.type(screen.getByRole("combobox"), "op.custom");
    await userEvent.tab();

    expect(onPick).not.toHaveBeenCalled();
  });

  it("still commits unmatched text on Enter when commitOnBlur is off", async () => {
    const onPick = jest.fn();
    render(<Harness allowFreeText commitOnBlur={false} onPick={onPick} />);
    await userEvent.type(screen.getByRole("combobox"), "op.custom{Enter}");

    expect(onPick).toHaveBeenCalledWith({
      id: "op.custom",
      label: "op.custom",
    });
  });

  it("renders the list outside the field's subtree when portal is set", async () => {
    render(<Harness portal />);
    const field = screen.getByRole("combobox");
    await userEvent.click(field);

    const list = screen.getByRole("listbox");
    expect(field.parentElement?.contains(list)).toBe(false);
    expect(screen.getAllByRole("option")).toHaveLength(OPTIONS.length);
  });

  it("closes a portaled list on an outside click but not on a list click", async () => {
    render(<Harness portal />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.pointer({
      keys: "[MouseLeft]",
      target: screen.getByRole("listbox"),
    });
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.pointer({ keys: "[MouseLeft]", target: document.body });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows the empty message when there are no options", async () => {
    render(<Harness options={[]} emptyMessage="Nothing here" />);
    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("shows a spinner instead of the list while loading", async () => {
    render(<Harness options={[]} loading emptyMessage="Nothing here" />);
    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.queryByText("Nothing here")).not.toBeInTheDocument();
  });
});

describe("Combobox clearing", () => {
  it("clears the selection when the emptied field is confirmed", async () => {
    const onPick = jest.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("beta"));
    onPick.mockClear();

    await userEvent.clear(screen.getByRole("combobox"));
    await userEvent.keyboard("{Enter}");

    // Not the highlighted option — an empty field means no filter.
    expect(onPick).toHaveBeenLastCalledWith(null);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("clears on blur too, with free text off", async () => {
    const onPick = jest.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("alpha"));
    onPick.mockClear();

    await userEvent.clear(screen.getByRole("combobox"));
    await userEvent.tab();

    expect(onPick).toHaveBeenLastCalledWith(null);
  });
});
