/**
 * Transition design tokens for the VOODO design system.
 *
 * Three layers:
 *  1. `duration`  — how long a transition takes
 *  2. `easing`    — the timing curve (how it accelerates / decelerates)
 *  3. `preset`    — pre-composed shorthand values for common UI patterns
 *
 * These are compiled into CSS custom properties by the generate-tailwind-theme
 * script and consumed through the TypeScript helpers in `src/types/transition.ts`.
 */
export const transitions = {
  /**
   * Duration tokens — semantic names for how long an animation takes.
   *
   * instant   (0ms)   Use for state that should feel truly immediate.
   * fast      (100ms) Micro-interactions: hover highlights, icon swaps.
   * normal    (200ms) Default: color, border, and opacity changes.
   * moderate  (300ms) Slightly heavier state changes: panel reveals, tooltips.
   * slow      (500ms) Deliberate motion: drawers, slide-in panels.
   * deliberate(700ms) Page-level or dramatic transitions.
   */
  duration: {
    instant: "0ms",
    fast: "100ms",
    normal: "200ms",
    moderate: "300ms",
    slow: "500ms",
    deliberate: "700ms",
  },

  /**
   * Easing (timing-function) tokens.
   *
   * linear   Constant speed.  Mechanical feel; suits progress bars/loaders.
   * in       Starts slow, accelerates.  Best for exits / elements leaving the screen.
   * out      Starts fast, decelerates.  Best for entrances / elements arriving.
   * in-out   Slow start and end.  Best for general UI state changes.
   * spring   Slight overshoot then settles.  Adds energy to interactive elements.
   * sharp    Quick in, gradual out.  Crisp, snappy feel for menus/overlays.
   */
  easing: {
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
  },

  /**
   * Pre-composed transition shorthands for common UI patterns.
   * These bake in the right duration + easing for each context so
   * component authors pick semantics, not numbers.
   *
   * colors   Background, text, border, fill, and stroke color changes.
   * opacity  Fade in/out.
   * transform Scale, translate, and rotate.
   * shadow   Box-shadow elevation changes.
   * menu     Dropdown / context menu appear and disappear.
   * panel    Drawers and slide-in sheets.
   * overlay  Modal backdrop fade.
   * all      General-purpose catch-all.
   */
  preset: {
    colors:
      "color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), fill 200ms cubic-bezier(0.4, 0, 0.2, 1), stroke 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "transform 200ms cubic-bezier(0, 0, 0.2, 1)",
    shadow: "box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    menu: "opacity 100ms cubic-bezier(0, 0, 0.2, 1), transform 100ms cubic-bezier(0, 0, 0.2, 1)",
    panel: "transform 300ms cubic-bezier(0, 0, 0.2, 1)",
    overlay: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    all: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;
