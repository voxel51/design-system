/**
 * Transition type system for the VOODO design system.
 *
 * Three enums map to the three layers of CSS custom properties generated
 * from `src/theme/tokens/transitions.ts`:
 *
 *   TransitionDuration  →  --transition-duration-{name}
 *   TransitionEasing    →  --transition-easing-{name}
 *   TransitionPreset    →  --transition-preset-{name}
 *
 * The helper functions return Tailwind arbitrary-value classes that
 * reference those variables, keeping component code declarative:
 *
 * @example
 * ```tsx
 * // Individual duration + easing
 * <div className={cn(
 *   transitionDuration(TransitionDuration.Normal),
 *   transitionEasing(TransitionEasing.Out),
 *   "transition-transform"
 * )} />
 *
 * // Pre-composed preset
 * <div style={{ transition: transitionPresetValue(TransitionPreset.Panel) }} />
 * ```
 */

/**
 * Semantic names for how long a transition takes.
 * Maps to `--transition-duration-{name}` CSS variables.
 */
export const TransitionDuration = {
  /** 0ms — truly immediate, no perceivable animation. */
  Instant: "instant",
  /** 100ms — micro-interactions: hover highlights, icon swaps. */
  Fast: "fast",
  /** 200ms — default for color, border, and opacity changes. */
  Normal: "normal",
  /** 300ms — panel reveals, tooltips, slightly heavier state changes. */
  Moderate: "moderate",
  /** 500ms — drawers, slide-in sheets. */
  Slow: "slow",
  /** 700ms — page-level or dramatic reveal transitions. */
  Deliberate: "deliberate",
} as const;
export type TransitionDuration =
  `${(typeof TransitionDuration)[keyof typeof TransitionDuration]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TransitionDuration {
  export type Instant = typeof TransitionDuration.Instant;
  export type Fast = typeof TransitionDuration.Fast;
  export type Normal = typeof TransitionDuration.Normal;
  export type Moderate = typeof TransitionDuration.Moderate;
  export type Slow = typeof TransitionDuration.Slow;
  export type Deliberate = typeof TransitionDuration.Deliberate;
}

/**
 * Timing-curve tokens that control how a transition accelerates.
 * Maps to `--transition-easing-{name}` CSS variables.
 */
export const TransitionEasing = {
  /** Constant speed. Suits progress bars and loaders. */
  Linear: "linear",
  /** Starts slow, accelerates. Best for elements *leaving* the screen. */
  In: "in",
  /** Starts fast, decelerates. Best for elements *arriving* on screen. */
  Out: "out",
  /** Slow start and end. Best for general UI state changes. */
  InOut: "in-out",
  /** Slight overshoot then settles. Adds energy to interactive elements. */
  Spring: "spring",
  /** Quick in, gradual out. Crisp, snappy feel for menus and overlays. */
  Sharp: "sharp",
} as const;
export type TransitionEasing =
  `${(typeof TransitionEasing)[keyof typeof TransitionEasing]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TransitionEasing {
  export type Linear = typeof TransitionEasing.Linear;
  export type In = typeof TransitionEasing.In;
  export type Out = typeof TransitionEasing.Out;
  export type InOut = typeof TransitionEasing.InOut;
  export type Spring = typeof TransitionEasing.Spring;
  export type Sharp = typeof TransitionEasing.Sharp;
}

/**
 * Pre-composed transition shorthands for common UI patterns.
 * Bakes in the right duration + easing so component authors pick semantics,
 * not numbers. Maps to `--transition-preset-{name}` CSS variables.
 */
export const TransitionPreset = {
  /** Background, text, border, fill, and stroke color changes. */
  Colors: "colors",
  /** Fade in / fade out. */
  Opacity: "opacity",
  /** Scale, translate, and rotate. */
  Transform: "transform",
  /** Box-shadow elevation changes. */
  Shadow: "shadow",
  /** Dropdown / context menu appear and disappear. */
  Menu: "menu",
  /** Drawers and slide-in sheets. */
  Panel: "panel",
  /** Modal backdrop fade. */
  Overlay: "overlay",
  /** General-purpose catch-all. */
  All: "all",
} as const;
export type TransitionPreset =
  `${(typeof TransitionPreset)[keyof typeof TransitionPreset]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TransitionPreset {
  export type Colors = typeof TransitionPreset.Colors;
  export type Opacity = typeof TransitionPreset.Opacity;
  export type Transform = typeof TransitionPreset.Transform;
  export type Shadow = typeof TransitionPreset.Shadow;
  export type Menu = typeof TransitionPreset.Menu;
  export type Panel = typeof TransitionPreset.Panel;
  export type Overlay = typeof TransitionPreset.Overlay;
  export type All = typeof TransitionPreset.All;
}

/**
 * Returns a Tailwind `duration-[var(...)]` class for the given duration token.
 *
 * @example
 * ```tsx
 * <div className={cn("transition-colors", transitionDuration(TransitionDuration.Fast))} />
 * // → "transition-colors duration-[var(--transition-duration-fast)]"
 * ```
 */
export function transitionDuration(duration: TransitionDuration): string {
  return `duration-[var(--transition-duration-${duration})]`;
}

/**
 * Returns a Tailwind `ease-[var(...)]` class for the given easing token.
 *
 * @example
 * ```tsx
 * <div className={cn("transition-transform", transitionEasing(TransitionEasing.Out))} />
 * // → "transition-transform ease-[var(--transition-easing-out)]"
 * ```
 */
export function transitionEasing(easing: TransitionEasing): string {
  return `ease-[var(--transition-easing-${easing})]`;
}

/**
 * Returns a Tailwind `transition-[var(...)]` class for the given preset token.
 * The preset encodes both the property list, duration, and easing in one token.
 *
 * @example
 * ```tsx
 * <div className={transitionPreset(TransitionPreset.Colors)} />
 * // → "transition-[var(--transition-preset-colors)]"
 * ```
 */
export function transitionPreset(preset: TransitionPreset): string {
  return `transition-[var(--transition-preset-${preset})]`;
}

/**
 * Returns the raw CSS `var(--transition-preset-{name})` string for use in
 * `style` props or inline CSS where a Tailwind class is not appropriate.
 *
 * @example
 * ```tsx
 * <div style={{ transition: transitionPresetValue(TransitionPreset.Panel) }} />
 * ```
 */
export function transitionPresetValue(preset: TransitionPreset): string {
  return `var(--transition-preset-${preset})`;
}
