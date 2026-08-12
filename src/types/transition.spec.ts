import {
  TransitionDuration,
  TransitionEasing,
  TransitionPreset,
  transitionDuration,
  transitionEasing,
  transitionPreset,
  transitionPresetValue,
} from "./transition";

describe("transitionDuration", () => {
  it.each(Object.values(TransitionDuration))(
    "returns a Tailwind duration class for %s",
    (duration) => {
      expect(transitionDuration(duration)).toBe(
        `duration-[var(--transition-duration-${duration})]`
      );
    }
  );
});

describe("transitionEasing", () => {
  it.each(Object.values(TransitionEasing))(
    "returns a Tailwind ease class for %s",
    (easing) => {
      expect(transitionEasing(easing)).toBe(
        `ease-[var(--transition-easing-${easing})]`
      );
    }
  );
});

describe("transitionPreset", () => {
  it.each(Object.values(TransitionPreset))(
    "returns a Tailwind transition class for %s",
    (preset) => {
      expect(transitionPreset(preset)).toBe(
        `transition-[var(--transition-preset-${preset})]`
      );
    }
  );
});

describe("transitionPresetValue", () => {
  it.each(Object.values(TransitionPreset))(
    "returns a raw CSS var() string for %s",
    (preset) => {
      expect(transitionPresetValue(preset)).toBe(
        `var(--transition-preset-${preset})`
      );
    }
  );
});
