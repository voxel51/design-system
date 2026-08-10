import { render } from "@testing-library/react";

import { Button } from "@/components/Button";
import { Pill } from "@/components/Pill";
import { Size, TextColor, textColorClass } from "@/types";
import { IconName } from "@/types/icons";

import { resolveIconInput } from "./Icon";
import { IconWrapper } from "./IconWrapper";
import { AddIcon } from "./icons";

// Bridge behavior: icon props accept both the per-icon components and
// legacy IconName values, so pre-0.0.40 consumers compile and render
// unchanged. Remove alongside the legacy icon module.
describe("IconInput bridge", () => {
  it("IconWrapper renders a legacy IconName", () => {
    const { container } = render(<IconWrapper content={IconName.Add} />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("IconWrapper renders a per-icon component", () => {
    const { container } = render(<IconWrapper content={AddIcon} />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("Button accepts a legacy IconName for leadingIcon", () => {
    const { container } = render(
      <Button leadingIcon={IconName.Add}>Add</Button>
    );
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("Pill accepts a legacy IconName for icon", () => {
    const { container } = render(<Pill icon={IconName.Add}>3</Pill>);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("resolveIconInput passes component references through unchanged", () => {
    expect(resolveIconInput(AddIcon)).toBe(AddIcon);
    expect(resolveIconInput(undefined)).toBeUndefined();
  });

  it("resolves a legacy IconName to a stable component identity", () => {
    // regression: a fresh wrapper per call changes the element type and
    // remounts the icon subtree on every parent re-render
    expect(resolveIconInput(IconName.Add)).toBe(resolveIconInput(IconName.Add));
  });

  it("forwards all icon props (including color) to a legacy icon", () => {
    // regression: the resolver must not drop props the call site passes
    const Legacy = resolveIconInput(IconName.Add);
    if (!Legacy) throw new Error("expected a component");
    const { container } = render(
      <Legacy size={Size.Sm} color={TextColor.Primary} className="extra" />
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("extra");
    expect(svg?.getAttribute("class")).toContain(
      textColorClass(TextColor.Primary)
    );
  });
});
