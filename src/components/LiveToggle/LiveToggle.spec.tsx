import { fireEvent, render, screen } from "@testing-library/react";

import { LiveToggle } from "./LiveToggle";

describe("LiveToggle", () => {
  it("shows Live while on and turns off from the menu", () => {
    const onCheckedChange = jest.fn();
    render(<LiveToggle checked onCheckedChange={onCheckedChange} />);

    const trigger = screen.getByRole("button", { name: "Auto refresh: on" });
    expect(trigger).toHaveTextContent("Live");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Auto refresh"));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("shows Paused while off and offers Refresh now", () => {
    const onRefresh = jest.fn();
    render(
      <LiveToggle
        checked={false}
        onCheckedChange={jest.fn()}
        onRefresh={onRefresh}
      />
    );

    const trigger = screen.getByRole("button", { name: "Auto refresh: off" });
    expect(trigger).toHaveTextContent("Paused");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Refresh now"));
    expect(onRefresh).toHaveBeenCalled();
  });
});
