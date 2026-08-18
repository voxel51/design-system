import {
  siKubernetes,
  siArgo,
  siApacheairflow,
  siRay,
  siDask,
  siQdrant,
  siJupyter,
  siDocker,
  siPython,
} from "simple-icons";
import { cn } from "../../../lib/utils";

/**
 * Catalog of brand glyphs we surface in the Services UI.
 * Each entry exposes the official simple-icons SVG path so we can
 * render it ourselves at any size and color (monochrome).
 */
const brandMap = {
  kubernetes: siKubernetes,
  argo: siArgo,
  airflow: siApacheairflow,
  ray: siRay,
  dask: siDask,
  qdrant: siQdrant,
  jupyter: siJupyter,
  docker: siDocker,
  python: siPython,
} as const;

export type BrandName = keyof typeof brandMap;

interface BrandIconProps {
  name: BrandName;
  size?: number;
  /** When true, render the brand's official color; otherwise use currentColor. */
  color?: boolean;
  className?: string;
  title?: string;
}

export function BrandIcon({ name, size = 14, color = false, className, title }: BrandIconProps) {
  const icon = brandMap[name];
  return (
    <svg
      role="img"
      aria-label={title ?? icon.title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color ? `#${icon.hex}` : "currentColor"}
      className={cn("shrink-0", className)}
    >
      <path d={icon.path} />
    </svg>
  );
}

export const brandLabel: Record<BrandName, string> = {
  kubernetes: "Kubernetes",
  argo: "Argo",
  airflow: "Airflow",
  ray: "Ray",
  dask: "Dask",
  qdrant: "Qdrant",
  jupyter: "Jupyter",
  docker: "Docker",
  python: "Python",
};
