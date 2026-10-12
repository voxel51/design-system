import type { FC } from "react";

import { Loader, type LoaderProps } from "@/components/Loader";

export type SpinnerProps = Omit<LoaderProps, "type">;

/**
 * An animated spinner component. Shorthand for `<Loader type="spinner" />`.
 *
 * @example
 * ```tsx
 * <Spinner size="md" />
 * ```
 *
 * @param className `class` overrides to apply to the component.
 * @param size Size of the component. See {@link Size}.
 * @param props Additional HTML properties to apply to the component.
 */
export const Spinner: FC<SpinnerProps> = (props) => (
  <Loader {...props} type="spinner" />
);

Spinner.displayName = "Spinner";
