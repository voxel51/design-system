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
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(onPick).toHaveBeenCalledWith(OPTIONS[2]);
  });

  it("wraps the highlight past the ends", async () => {
    const onPick = jest.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("{ArrowUp}{Enter}");

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
