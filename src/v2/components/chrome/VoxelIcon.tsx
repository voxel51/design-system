import { useEffect, useRef, useState } from "react";

/** Animated voxel-cube icon — brand mark for Voxel Agent
 *  `animate`: sequential line-draw assembly → traveling-light idle → graceful settle
 *  `idle`: continuous ambient motion; set false to settle to static
 */
export function VoxelIcon({
  className = "",
  size = 24,
  animate = false,
  idle = true,
}: {
  className?: string;
  size?: number;
  animate?: boolean;
  idle?: boolean;
}) {
  const uid = useRef(`vi-${Math.random().toString(36).slice(2, 6)}`).current;
  const [phase, setPhase] = useState(0);
  const assembled = !animate || phase >= 10;
  const shouldIdle = animate && idle && assembled;
  const settling = animate && !idle && assembled;

  useEffect(() => {
    if (!animate) return;
    const interval = 130;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setPhase(step);
      if (step >= 10) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [animate]);

  const show = (step: number) => (!animate ? true : phase >= step);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Step 1: Apex vertex drops in with spring */}
      <circle
        cx="16"
        cy="4"
        r="1.5"
        fill="hsl(var(--voxel-vertex))"
        filter={`url(#${uid}-glow)`}
        className={shouldIdle ? "voxel-apex-idle" : settling ? "voxel-settle" : ""}
        style={{
          opacity: show(1) ? 1 : 0,
          transform: show(1) ? "translateY(0) scale(1)" : "translateY(10px) scale(1.8)",
          transition: "opacity 0.2s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformOrigin: "16px 4px",
        }}
      />

      {/* Step 2: Top-left edge — spring ease */}
      <Edge d="M16,4 L4,10" len={14} visible={show(2)} idleIndex={0} idle={shouldIdle} settling={settling}
        stroke="hsl(var(--voxel-edge-1) / var(--voxel-edge-1-a))" easing="cubic-bezier(0.16, 1, 0.3, 1)" dur={0.4} />

      {/* Step 3: Top-right edge — spring ease */}
      <Edge d="M16,4 L28,10" len={14} visible={show(3)} idleIndex={1} idle={shouldIdle} settling={settling}
        stroke="hsl(var(--voxel-edge-1) / var(--voxel-edge-1-a))" easing="cubic-bezier(0.16, 1, 0.3, 1)" dur={0.4} />

      {/* Step 4: Left vertical — ease-out (gravity) */}
      <Edge d="M4,10 L4,22" len={12} visible={show(4)} idleIndex={2} idle={shouldIdle} settling={settling}
        stroke="hsl(var(--voxel-edge-2) / var(--voxel-edge-2-a))" easing="cubic-bezier(0, 0, 0.2, 1)" dur={0.35} />

      {/* Step 5: Right vertical — ease-out (gravity) */}
      <Edge d="M28,10 L28,22" len={12} visible={show(5)} idleIndex={3} idle={shouldIdle} settling={settling}
        stroke="hsl(var(--voxel-edge-2) / var(--voxel-edge-2-a))" easing="cubic-bezier(0, 0, 0.2, 1)" dur={0.35} />

      {/* Step 6: Bottom-left — ease-in-out (closing) */}
      <Edge d="M4,22 L16,28" len={14} visible={show(6)} idleIndex={4} idle={shouldIdle} settling={settling}
        stroke="hsl(var(--voxel-edge-3) / var(--voxel-edge-3-a))" easing="ease-in-out" dur={0.3} />

      {/* Step 7: Bottom-right — ease-in-out (closing) */}
      <Edge d="M28,22 L16,28" len={14} visible={show(7)} idleIndex={5} idle={shouldIdle} settling={settling}
        stroke="hsl(var(--voxel-edge-3) / var(--voxel-edge-3-a))" easing="ease-in-out" dur={0.3} />

      {/* Step 8: Internal structure */}
      <Edge d="M4,10 L16,16 L28,10" len={28} visible={show(8)} idleIndex={6} idle={shouldIdle} settling={settling}
        stroke="hsl(var(--voxel-edge-3) / var(--voxel-edge-3-a))" width={0.6} easing="ease-in-out" dur={0.3} />
      <Edge d="M16,16 L16,28" len={12} visible={show(8)} idleIndex={7} idle={shouldIdle} settling={settling}
        stroke="hsl(var(--voxel-edge-3) / var(--voxel-edge-3-a))" width={0.6} easing="ease-in-out" dur={0.3} />

      {/* Step 9: Top + Left faces */}
      <polygon
        points="16,4 28,10 16,16 4,10"
        fill="hsl(var(--voxel-face-top) / var(--voxel-face-top-a))"
        className={shouldIdle ? "voxel-face-idle voxel-face-idle-0" : settling ? "voxel-face-settle" : ""}
        style={{ opacity: show(9) ? 1 : 0, transition: "opacity 0.35s ease" }}
      />
      <polygon
        points="16,4 4,10 4,22 16,28"
        fill="hsl(var(--voxel-face-left) / var(--voxel-face-left-a))"
        className={shouldIdle ? "voxel-face-idle voxel-face-idle-1" : settling ? "voxel-face-settle" : ""}
        style={{ opacity: show(9) ? 1 : 0, transition: "opacity 0.4s ease 0.05s" }}
      />

      {/* Step 10: Right face (last) */}
      <polygon
        points="16,4 28,10 28,22 16,28"
        fill="hsl(var(--voxel-face-right) / var(--voxel-face-right-a))"
        className={shouldIdle ? "voxel-face-idle voxel-face-idle-2" : settling ? "voxel-face-settle" : ""}
        style={{ opacity: show(10) ? 1 : 0, transition: "opacity 0.4s ease" }}
      />
    </svg>
  );
}

/** Single edge with varied easing + traveling-light idle */
function Edge({
  d, len, visible, idle, settling, idleIndex, stroke, width = 0.8, easing = "ease", dur = 0.35,
}: {
  d: string; len: number; visible: boolean; idle: boolean; settling: boolean;
  idleIndex: number; stroke: string; width?: number; easing?: string; dur?: number;
}) {
  // Traveling light: each edge pulses with a staggered delay
  const idleClass = idle ? `voxel-edge-idle voxel-edge-idle-${idleIndex}` : settling ? "voxel-edge-settle" : "";

  return (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
      className={idleClass}
      style={{
        strokeDasharray: len,
        strokeDashoffset: visible ? 0 : len,
        transition: `stroke-dashoffset ${dur}s ${easing}`,
      }}
    />
  );
}
