import { act, render } from "@testing-library/react";

import { Stack } from "@/components/Stack";

describe("Stack scroll edges", () => {
  it("fades the end when content overflows", () => {
    const { container } = render(
      <Stack scroll>
        <span>a</span>
      </Stack>
    );
    const el = container.firstElementChild as HTMLElement;
    Object.defineProperty(el, "scrollWidth", {
      value: 500,
      configurable: true,
    });
    Object.defineProperty(el, "clientWidth", {
      value: 100,
      configurable: true,
    });
    act(() => {
      el.dispatchEvent(new Event("scroll"));
    });
    expect(el.getAttribute("style")).toContain("linear-gradient");
  });
});
