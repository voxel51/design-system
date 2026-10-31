import { type CSSProperties, type FC, type ReactNode, useId } from "react";

import { cn } from "@/util/classes";

import styles from "./EmptyArt.module.css";

export interface EmptyArtProps {
  className?: string;
}

const ACCENT = "var(--ea-accent)";
const BORDER = "var(--ea-border)";
const BORDER_STRONG = "var(--ea-border-strong)";
const CARD = "var(--ea-card)";

// The comments art runs on a slower 6s cycle with a shared easing.
const SLOW: CSSProperties = {
  animationDuration: "6s",
  animationTimingFunction: "cubic-bezier(.4,0,.2,1)",
};

const Art: FC<
  EmptyArtProps & {
    label: string;
    glow: { cx: number; cy: number; rx: number; ry: number };
    children: (glowId: string) => ReactNode;
  }
> = ({ className, label, glow, children }) => {
  const id = useId();
  return (
    <svg
      viewBox="0 0 160 112"
      fill="none"
      role="img"
      aria-label={label}
      className={cn(styles.art, className)}
    >
      <defs>
        <radialGradient id={`${id}glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.18" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse {...glow} fill={`url(#${id}glow)`} />
      {children(id)}
    </svg>
  );
};

/**
 * Attention travelling across a frame and resolving into a thread: the
 * "no comments yet" art.
 *
 * @example
 * ```tsx
 * <EmptyState art={<CommentsEmptyArt />} title="No comments yet" />
 * ```
 *
 * @param className Extra classes for the SVG; it fills its container's width.
 */
export const CommentsEmptyArt: FC<EmptyArtProps> = ({ className }) => {
  const bracket = (x: number, y: number, sx: number, sy: number): ReactNode => (
    <path
      key={`${x}-${y}`}
      d="M0 7V2a2 2 0 0 1 2-2h5"
      transform={`translate(${x} ${y}) scale(${sx} ${sy})`}
      stroke={ACCENT}
      strokeOpacity="0.9"
      strokeWidth="1.4"
      fill="none"
      strokeLinecap="round"
    />
  );
  return (
    <Art
      className={className}
      label="No comments yet"
      glow={{ cx: 80, cy: 58, rx: 60, ry: 42 }}
    >
      {(id) => (
        <>
          <defs>
            <linearGradient id={`${id}sweep`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={ACCENT} stopOpacity="0" />
              <stop offset="50%" stopColor={ACCENT} stopOpacity="0.16" />
              <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${id}frame`}>
              <rect x="23" y="21" width="114" height="70" rx="9" />
            </clipPath>
          </defs>
          <rect
            x="22.5"
            y="20.5"
            width="115"
            height="71"
            rx="9"
            stroke={BORDER_STRONG}
          />
          <g clipPath={`url(#${id}frame)`}>
            <g className={styles.sweep}>
              <rect
                x="0"
                y="14"
                width="46"
                height="84"
                fill={`url(#${id}sweep)`}
                transform="skewX(-12)"
              />
            </g>
            <path
              d="M23 76c14-3 22-14 33-14s16 9 27 7 20-13 33-13 13 3 21 5"
              stroke={BORDER_STRONG}
              strokeOpacity="0.8"
              strokeLinecap="round"
            />
          </g>
          <g
            className={styles.lock}
            style={{ ...SLOW, transformOrigin: "60px 53px" }}
          >
            {bracket(41, 38, 1, 1)}
            {bracket(79, 38, -1, 1)}
            {bracket(41, 68, 1, -1)}
            {bracket(79, 68, -1, -1)}
          </g>
          <path
            d="M74 62c12 4 14 10 22 14"
            stroke={ACCENT}
            strokeOpacity="0.55"
            strokeLinecap="round"
            strokeDasharray="64"
            className={styles.thread}
            style={SLOW}
          />
          <circle
            cx="99"
            cy="47"
            r="12"
            stroke={ACCENT}
            strokeOpacity="0.3"
            className={styles.ripple}
            style={{ animationDuration: "6s", transformOrigin: "99px 47px" }}
          />
          <circle
            cx="99"
            cy="47"
            r="3.25"
            fill={ACCENT}
            className={styles.core}
            style={{ animationDuration: "6s" }}
          />
          <path
            d="M96 78h30a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6h-16l-8 7v-7h-6a6 6 0 0 1-6-6V84a6 6 0 0 1 6-6Z"
            fill={CARD}
            stroke={BORDER}
          />
          <path
            d="M101 86h20"
            stroke={ACCENT}
            strokeOpacity="0.6"
            strokeLinecap="round"
            className={styles.typeline}
            style={{ ...SLOW, transformOrigin: "101px 86px" }}
          />
          <path
            d="M101 92h13"
            stroke={BORDER}
            strokeLinecap="round"
            className={styles.typeline}
            style={{
              ...SLOW,
              animationDelay: ".12s",
              transformOrigin: "101px 92px",
            }}
          />
        </>
      )}
    </Art>
  );
};
CommentsEmptyArt.displayName = "CommentsEmptyArt";

/**
 * A timeline assembling itself: the "no history yet" art.
 *
 * @example
 * ```tsx
 * <EmptyState art={<HistoryEmptyArt />} title="No history yet" />
 * ```
 *
 * @param className Extra classes for the SVG; it fills its container's width.
 */
export const HistoryEmptyArt: FC<EmptyArtProps> = ({ className }) => (
  <Art
    className={className}
    label="No history yet"
    glow={{ cx: 80, cy: 58, rx: 58, ry: 40 }}
  >
    {() => (
      <>
        <path
          d="M52 24v64"
          stroke={BORDER}
          strokeLinecap="round"
          strokeDasharray="72"
          className={styles.spine}
        />
        {[30, 52, 74].map((y, i) => (
          <g
            key={y}
            className={styles.rise}
            style={{ animationDelay: `${i * 0.45}s` }}
          >
            <circle
              cx="52"
              cy={y}
              r="3.5"
              fill={CARD}
              stroke={i === 0 ? ACCENT : BORDER}
            />
            <rect
              x="66"
              y={y - 7}
              width={i === 0 ? 54 : 42}
              height="4"
              rx="2"
              fill={BORDER}
            />
            <rect
              x="66"
              y={y + 1}
              width={i === 0 ? 30 : 22}
              height="4"
              rx="2"
              fill={ACCENT}
              fillOpacity={i === 0 ? 0.45 : 0.18}
            />
          </g>
        ))}
      </>
    )}
  </Art>
);
HistoryEmptyArt.displayName = "HistoryEmptyArt";

/**
 * A scan converging on one match in a grid: the "no results" art.
 *
 * @example
 * ```tsx
 * <EmptyState art={<SearchEmptyArt />} title="Nothing matches yet" />
 * ```
 *
 * @param className Extra classes for the SVG; it fills its container's width.
 */
export const SearchEmptyArt: FC<EmptyArtProps> = ({ className }) => (
  <Art
    className={className}
    label="No results"
    glow={{ cx: 80, cy: 58, rx: 58, ry: 40 }}
  >
    {() => (
      <>
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={40 + c * 22}
              y={32 + r * 20}
              width="16"
              height="14"
              rx="3"
              fill={BORDER}
              fillOpacity="0.35"
            />
          ))
        )}
        <g className={styles.scan}>
          <rect
            x="36"
            y="30"
            width="94"
            height="18"
            rx="4"
            fill={ACCENT}
            fillOpacity="0.1"
          />
          <path
            d="M36 48h94"
            stroke={ACCENT}
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
        </g>
        <rect
          x="84"
          y="52"
          width="16"
          height="14"
          rx="3"
          fill={ACCENT}
          fillOpacity="0.5"
          className={styles.breathe}
        />
      </>
    )}
  </Art>
);
SearchEmptyArt.displayName = "SearchEmptyArt";

/**
 * Scattered samples pulled into a neighbourhood around one anchor: the
 * "no similarity index yet" art.
 *
 * @example
 * ```tsx
 * <EmptyState art={<SimilarityEmptyArt />} title="No similarity index yet" />
 * ```
 *
 * @param className Extra classes for the SVG; it fills its container's width.
 */
export const SimilarityEmptyArt: FC<EmptyArtProps> = ({ className }) => (
  <Art
    className={className}
    label="No similarity index yet"
    glow={{ cx: 80, cy: 56, rx: 58, ry: 40 }}
  >
    {() => (
      <>
        <circle cx="80" cy="56" r="30" stroke={BORDER} strokeDasharray="3 5" />
        <circle
          cx="80"
          cy="56"
          r="18"
          stroke={ACCENT}
          strokeOpacity="0.35"
          className={styles.ripple}
          style={{ transformOrigin: "80px 56px" }}
        />
        <circle cx="80" cy="56" r="4" fill={ACCENT} className={styles.core} />
        {[
          { x: 46, y: 34 },
          { x: 116, y: 38 },
          { x: 38, y: 72 },
          { x: 122, y: 74 },
          { x: 66, y: 24 },
          { x: 98, y: 88 },
        ].map((d, i) => (
          <g
            key={`${d.x}-${d.y}`}
            className={styles.gather}
            style={{
              transformOrigin: "80px 56px",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <path
              d={`M80 56 L${d.x} ${d.y}`}
              stroke={ACCENT}
              strokeOpacity="0.22"
              strokeLinecap="round"
            />
            <circle
              cx={d.x}
              cy={d.y}
              r="3"
              fill={CARD}
              stroke={BORDER_STRONG}
            />
          </g>
        ))}
      </>
    )}
  </Art>
);
SimilarityEmptyArt.displayName = "SimilarityEmptyArt";

/**
 * Bars rising into a comparison, a scorecard writing itself: the
 * "no evaluations yet" art.
 *
 * @example
 * ```tsx
 * <EmptyState art={<EvaluationEmptyArt />} title="No evaluations yet" />
 * ```
 *
 * @param className Extra classes for the SVG; it fills its container's width.
 */
export const EvaluationEmptyArt: FC<EmptyArtProps> = ({ className }) => (
  <Art
    className={className}
    label="No evaluations yet"
    glow={{ cx: 80, cy: 58, rx: 58, ry: 40 }}
  >
    {() => (
      <>
        <path d="M36 84h96" stroke={BORDER_STRONG} strokeLinecap="round" />
        {[
          { x: 48, h: 26 },
          { x: 70, h: 42 },
          { x: 92, h: 32 },
          { x: 114, h: 50 },
        ].map((b, i) => (
          <rect
            key={b.x}
            x={b.x}
            y={84 - b.h}
            width="12"
            height={b.h}
            rx="3"
            fill={i === 3 ? ACCENT : BORDER}
            fillOpacity={i === 3 ? 0.55 : 0.5}
            className={styles.grow}
            style={{
              transformOrigin: `${b.x}px 84px`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
        <path
          d="M36 44h96"
          stroke={ACCENT}
          strokeOpacity="0.4"
          strokeDasharray="4 6"
          strokeLinecap="round"
          className={styles.breathe}
        />
      </>
    )}
  </Art>
);
EvaluationEmptyArt.displayName = "EvaluationEmptyArt";

/**
 * A panel surface assembling itself: the neutral "nothing here yet" art.
 *
 * @example
 * ```tsx
 * <EmptyState art={<PanelEmptyArt />} title="No runs yet" />
 * ```
 *
 * @param className Extra classes for the SVG; it fills its container's width.
 */
export const PanelEmptyArt: FC<EmptyArtProps> = ({ className }) => (
  <Art
    className={className}
    label="Nothing here yet"
    glow={{ cx: 80, cy: 56, rx: 56, ry: 38 }}
  >
    {() => (
      <>
        <rect
          x="34.5"
          y="26.5"
          width="91"
          height="60"
          rx="9"
          stroke={BORDER_STRONG}
        />
        {[52, 64, 38].map((width, i) => (
          <rect
            key={i}
            x="48"
            y={42 + i * 14}
            width={width}
            height="5"
            rx="2.5"
            fill={i === 0 ? ACCENT : BORDER}
            fillOpacity={i === 0 ? 0.45 : 1}
            className={styles.typeline}
            style={{
              transformOrigin: "48px 0",
              animationDelay: `${i * 0.14}s`,
            }}
          />
        ))}
      </>
    )}
  </Art>
);
PanelEmptyArt.displayName = "PanelEmptyArt";

/**
 * A box drawn and locked onto its subject: the "no annotations yet" art.
 *
 * @example
 * ```tsx
 * <EmptyState art={<AnnotationEmptyArt />} title="No annotations yet" />
 * ```
 *
 * @param className Extra classes for the SVG; it fills its container's width.
 */
export const AnnotationEmptyArt: FC<EmptyArtProps> = ({ className }) => (
  <Art
    className={className}
    label="No annotations yet"
    glow={{ cx: 80, cy: 56, rx: 56, ry: 38 }}
  >
    {() => (
      <>
        <rect
          x="34.5"
          y="26.5"
          width="91"
          height="60"
          rx="9"
          stroke={BORDER_STRONG}
        />
        <path
          d="M46 74l16-18 12 12 10-9 18 15"
          stroke={BORDER}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="59" cy="43" r="5" fill={BORDER} />
        <g className={styles.lock} style={{ transformOrigin: "84px 58px" }}>
          <rect
            x="66.5"
            y="42.5"
            width="35"
            height="31"
            rx="4"
            stroke={ACCENT}
            strokeOpacity="0.85"
          />
          {[
            [66.5, 42.5],
            [101.5, 42.5],
            [66.5, 73.5],
            [101.5, 73.5],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill={ACCENT} />
          ))}
        </g>
      </>
    )}
  </Art>
);
AnnotationEmptyArt.displayName = "AnnotationEmptyArt";

/**
 * Weights settling into a served model: the "no models yet" art.
 *
 * @example
 * ```tsx
 * <EmptyState art={<ModelsEmptyArt />} title="No models yet" />
 * ```
 *
 * @param className Extra classes for the SVG; it fills its container's width.
 */
export const ModelsEmptyArt: FC<EmptyArtProps> = ({ className }) => (
  <Art
    className={className}
    label="No models yet"
    glow={{ cx: 80, cy: 56, rx: 56, ry: 38 }}
  >
    {() => (
      <>
        {[34, 56, 78].map((y, i) => (
          <circle
            key={y}
            cx="44"
            cy={y}
            r="4"
            fill={BORDER}
            className={styles.breathe}
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
        {[34, 56, 78].map((y, i) => (
          <path
            key={`l${y}`}
            d={`M48 ${y}H74`}
            stroke={ACCENT}
            strokeOpacity="0.55"
            strokeLinecap="round"
            strokeDasharray="64"
            className={styles.thread}
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
        <rect
          x="76.5"
          y="40.5"
          width="40"
          height="32"
          rx="7"
          stroke={ACCENT}
          strokeOpacity="0.85"
        />
        <rect
          x="86"
          y="52"
          width="21"
          height="4"
          rx="2"
          fill={ACCENT}
          fillOpacity="0.6"
          className={styles.typeline}
          style={{ transformOrigin: "86px 0" }}
        />
        <rect x="86" y="60" width="13" height="4" rx="2" fill={BORDER} />
      </>
    )}
  </Art>
);
ModelsEmptyArt.displayName = "ModelsEmptyArt";
