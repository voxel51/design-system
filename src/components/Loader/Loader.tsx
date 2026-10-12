import type { CSSProperties, FC, HTMLAttributes } from "react";

import { SpinnerIcon } from "@/components/Icons/Spinner";
import { Size, TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";

import styles from "./Loader.module.css";

export const LoaderType = {
  Spinner: "spinner",
  Bars: "bars",
} as const;
export type LoaderType = `${(typeof LoaderType)[keyof typeof LoaderType]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LoaderType {
  export type Spinner = typeof LoaderType.Spinner;
  export type Bars = typeof LoaderType.Bars;
}

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  type?: LoaderType;
  size?: Size;
}

const spinnerSizeStyles: Record<Size, string> = {
  // Figma LoadingIndicator: XXS 10, SM-XS 14, MD 16, LG 18, XL 22.
  [Size.Xs]: "size-2.5",
  [Size.Sm]: "size-3.5",
  [Size.Md]: "size-4",
  [Size.Lg]: "size-4.5",
  [Size.Xl]: "size-[22px]",
};

const barsSizes: Record<Size, number> = {
  [Size.Xs]: 16,
  [Size.Sm]: 20,
  [Size.Md]: 24,
  [Size.Lg]: 28,
  [Size.Xl]: 32,
};

/**
 * A loading indicator that marks a region as busy, in one of several looks:
 * `"spinner"` is the spinning ring and `"bars"` is three gradient bars that grow
 * in turn, for work done by generative AI. Where {@link LoadingDots} marks a
 * piece of text as still resolving, this stands alone. {@link Spinner} is
 * `<Loader type="spinner" />`. Both announce "Loading" unless `aria-label` says
 * otherwise. `size` is per type: at `"xs"` the spinner is 10px and the bars are
 * 16px, so changing only `type` changes the footprint.
 *
 * @example
 * ```tsx
 * <Loader type="bars" size="xl" aria-label="Generating labels" />
 * ```
 *
 * @param type `"spinner"` or `"bars"`. Defaults to `"spinner"`. See {@link LoaderType}.
 * @param size Size of the loader. Defaults to `"md"`. See {@link Size}.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Loader: FC<LoaderProps> = ({
  type = LoaderType.Spinner,
  size = Size.Md,
  className,
  style,
  ...props
}) =>
  type === LoaderType.Bars ? (
    <div
      role="status"
      aria-label="Loading"
      className={cn(styles.bars, className)}
      style={
        { "--loader-size": `${barsSizes[size]}px`, ...style } as CSSProperties
      }
      {...props}
    >
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
    </div>
  ) : (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        spinnerSizeStyles[size],
        textColorClass(TextColor.Primary),
        className
      )}
      style={style}
      {...props}
    >
      <SpinnerIcon className="animate-spin" />
    </div>
  );

Loader.displayName = "Loader";
