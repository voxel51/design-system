import { act, renderHook } from "@testing-library/react";

import { colors } from "./tokens/colors";
import { chartPool, overlayPool, paletteSlots } from "./tokens/palette";
import { useColorMode, useColorPalette } from "./useColorPalette";

/**
 * Values are asserted against the token source rather than literal hex, so
 * these tests describe the hook's contract (ordering, mode resolution,
 * reactivity) and do not have to be updated every time a color changes.
 */

const setDark = async (dark: boolean): Promise<void> => {
  await act(async () => {
    document.documentElement.classList.toggle("dark", dark);

    // The MutationObserver callback fires in a microtask, so yield inside
    // act() to let the resulting re-render flush
    await Promise.resolve();
  });
};

describe("useColorMode", () => {
  // Reset inside act(): if a hook is still mounted, the observer fires and
  // schedules a re-render that React would otherwise flag as un-acted
  afterEach(() => setDark(false));

  it("reports light when the dark class is absent", () => {
    const { result } = renderHook(() => useColorMode());

    expect(result.current).toBe("light");
  });

  it("reports dark when the dark class is present", () => {
    document.documentElement.classList.add("dark");

    const { result } = renderHook(() => useColorMode());

    expect(result.current).toBe("dark");
  });

  it("updates when the dark class is toggled after mount", async () => {
    const { result } = renderHook(() => useColorMode());
    expect(result.current).toBe("light");

    await setDark(true);
    expect(result.current).toBe("dark");

    await setDark(false);
    expect(result.current).toBe("light");
  });

  it("stops observing after unmount", () => {
    const disconnect = jest.spyOn(MutationObserver.prototype, "disconnect");

    const { unmount } = renderHook(() => useColorMode());
    unmount();

    expect(disconnect).toHaveBeenCalled();

    disconnect.mockRestore();
  });
});

describe("useColorPalette", () => {
  // Reset inside act(): if a hook is still mounted, the observer fires and
  // schedules a re-render that React would otherwise flag as un-acted
  afterEach(() => setDark(false));

  it("exposes the ordered pool as an array", () => {
    document.documentElement.classList.add("dark");

    const { result } = renderHook(() => useColorPalette());

    expect(result.current.pool).toEqual(chartPool.dark);
  });

  it("exposes every hue the tokens define, and only those", () => {
    const { result } = renderHook(() => useColorPalette());

    // A palette is N colors, not a fixed count — assert against the tokens
    // rather than a hardcoded length
    expect(result.current.pool).toHaveLength(paletteSlots.length);
    expect(
      result.current.pool.every((color) => /^#[0-9A-F]{6}$/i.test(color))
    ).toBe(true);
  });

  it("exposes the hues by name alongside the pool", () => {
    const { result } = renderHook(() => useColorPalette());

    expect(result.current.teal).toBe(colors.light.content["viz-chart"].teal);
  });

  it("exposes the overlay pool, which does not follow the mode", () => {
    const { result } = renderHook(() => useColorPalette());

    expect(result.current.overlay).toEqual(overlayPool);
  });

  it("resolves values for the active mode", async () => {
    const { result } = renderHook(() => useColorPalette());

    expect(result.current.teal).toBe(colors.light.content["viz-chart"].teal);

    await setDark(true);

    expect(result.current.teal).toBe(colors.dark.content["viz-chart"].teal);
  });

  it("returns a stable reference while the mode is unchanged", () => {
    const { result, rerender } = renderHook(() => useColorPalette());
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it("returns a new reference when the mode changes", async () => {
    const { result } = renderHook(() => useColorPalette());
    const light = result.current;

    await setDark(true);

    expect(result.current).not.toBe(light);
  });
});
