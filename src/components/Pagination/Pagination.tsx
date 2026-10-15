import clsx from "clsx";
import {
  type FC,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  KeyboardArrowLeftIcon,
  KeyboardArrowRightIcon,
  KeyboardDoubleArrowLeftIcon,
  KeyboardDoubleArrowRightIcon,
} from "@/components/Icons";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  Radius,
  Size,
  TextColor,
  TextVariant,
  textColorClass,
} from "@/types";

import { getPageWindow } from "./pageWindow";

export const PaginationAlign = {
  Between: "between",
  Start: "start",
  Center: "center",
  End: "end",
} as const;
export type PaginationAlign =
  `${(typeof PaginationAlign)[keyof typeof PaginationAlign]}`;

export const PaginationJump = {
  Input: "input",
  Ellipsis: "ellipsis",
  Both: "both",
} as const;
export type PaginationJump =
  `${(typeof PaginationJump)[keyof typeof PaginationJump]}`;

export const PaginationPart = {
  Summary: "summary",
  PageSize: "page-size",
  Jump: "jump",
  Edges: "edges",
  Pages: "pages",
} as const;
export type PaginationPart =
  `${(typeof PaginationPart)[keyof typeof PaginationPart]}`;

const ALIGN_STYLES: Record<PaginationAlign, string> = {
  between: "justify-between",
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizes?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  total?: number;
  disabled?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
  align?: PaginationAlign;
  jump?: PaginationJump;
  hide?: PaginationPart[];
  className?: string;
}

const DEFAULT_PAGE_SIZES = [25, 50, 100];
const JUMP_THRESHOLD = 7;

/**
 * Page navigation for a paged list or table: numbered pages, first/previous/next/last,
 * an optional rows-per-page select, a range summary and a jump-to-page field.
 *
 * Pages are 1-indexed. The component is controlled: it renders `page` and reports
 * changes through `onPageChange` and `onPageSizeChange`. When its container is
 * narrower than 32rem it collapses to previous and next beside the summary.
 *
 * @example
 * ```tsx
 * <Pagination
 *   page={page}
 *   pageCount={Math.ceil(total / pageSize)}
 *   onPageChange={setPage}
 *   pageSize={pageSize}
 *   onPageSizeChange={setPageSize}
 *   total={total}
 * />
 * ```
 *
 * @param page The current page, starting at 1.
 * @param pageCount The total number of pages. Nothing renders when it is 1 or less
 *  and there is no page-size select.
 * @param onPageChange Called with the requested page, already clamped to `1..pageCount`.
 * @param pageSize The current rows per page. Required for the range summary and select.
 * @param pageSizes The selectable rows-per-page values. Defaults to `[25, 50, 100]`.
 * @param onPageSizeChange Called with the chosen rows per page. The select is hidden
 *  when omitted.
 * @param total The total number of rows. Enables the "1–25 of 312" summary; without it
 *  the summary reads "Page X of N".
 * @param disabled Disables every control.
 * @param siblingCount Pages shown either side of the current page. Defaults to 1.
 * @param boundaryCount Pages always shown at each end. Defaults to 1.
 * @param align Horizontal placement of the summary and controls: `"between"`
 *  (default, summary left and controls right), `"start"`, `"center"` or `"end"`.
 * @param jump How the user types a page number: `"input"` (default, a "Go to"
 *  field), `"ellipsis"` (clicking a `…` turns it into a field) or `"both"`.
 *  `hide=["jump"]` removes either.
 * @param hide Parts to leave out: `"summary"`, `"page-size"`, `"jump"`, `"edges"`
 *  (first and last buttons) and `"pages"` (numbered pages, keeping previous and next).
 * @param className Additional CSS class names for the root element.
 */
export const Pagination: FC<PaginationProps> = ({
  page,
  pageCount,
  onPageChange,
  pageSize,
  pageSizes = DEFAULT_PAGE_SIZES,
  onPageSizeChange,
  total,
  disabled = false,
  siblingCount = 1,
  boundaryCount = 1,
  align = PaginationAlign.Between,
  jump: jumpMode = PaginationJump.Input,
  hide = [],
  className,
}) => {
  const [jump, setJump] = useState(String(page));
  const [editing, setEditing] = useState<string | null>(null);
  useEffect(() => {
    setJump(String(page));
    setEditing(null);
  }, [page]);

  const items = useMemo(
    () => getPageWindow(page, pageCount, siblingCount, boundaryCount),
    [page, pageCount, siblingCount, boundaryCount]
  );
  const sizeOptions = useMemo(
    () =>
      (pageSizes.includes(pageSize ?? -1) || pageSize === undefined
        ? pageSizes
        : [...pageSizes, pageSize].sort((a, b) => a - b)
      ).map((n) => ({ id: String(n), data: { label: `${n} / page` } })),
    [pageSizes, pageSize]
  );

  const shows = (part: PaginationPart): boolean => !hide.includes(part);
  const hasSize = onPageSizeChange !== undefined && pageSize !== undefined;
  const showSize = hasSize && shows("page-size");
  if (pageCount <= 1 && !hasSize) return null;

  const goTo = (next: number): void => {
    const clamped = Math.min(Math.max(next, 1), Math.max(pageCount, 1));
    if (clamped !== page) onPageChange(clamped);
  };
  const commitJump = (): void => {
    const n = parseInt(jump, 10);
    if (Number.isNaN(n)) setJump(String(page));
    else goTo(n);
  };
  const onJumpKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") commitJump();
  };

  const first = page <= 1;
  const last = page >= pageCount;
  const [lead, range, rest] =
    total !== undefined && pageSize !== undefined
      ? [
          "",
          total === 0
            ? "0"
            : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)}`,
          ` of ${total.toLocaleString()}`,
        ]
      : ["Page ", String(page), ` of ${pageCount}`];

  return (
    <nav
      aria-label="Pagination"
      className={clsx(
        "@container flex w-full flex-wrap items-center gap-x-6 gap-y-3",
        ALIGN_STYLES[align],
        className
      )}
    >
      {(shows("summary") || showSize) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {shows("summary") && (
            <Text
              variant="body-tertiary"
              color={TextColor.Secondary}
              className="tabular-nums"
              aria-live="polite"
            >
              {lead}
              <span className={textColorClass(TextColor.Foreground)}>
                {range}
              </span>
              {rest}
            </Text>
          )}
          {showSize && (
            <div className="w-36">
              <Select
                exclusive
                size={Size.Sm}
                disabled={disabled}
                aria-label="Rows per page"
                value={String(pageSize)}
                options={sizeOptions}
                onChange={(v) =>
                  typeof v === "string" && onPageSizeChange(Number(v))
                }
              />
            </div>
          )}
        </div>
      )}

      <div
        className={clsx(
          "flex flex-wrap items-center gap-x-4 gap-y-2",
          align === PaginationAlign.Between && "ml-auto"
        )}
      >
        {pageCount > 1 && (
          <div
            className={clsx(
              "inline-flex items-center gap-0.5 p-0.5",
              radiusStyles(Radius.Md),
              bgColorClass(BackgroundColor.Muted)
            )}
          >
            {shows("edges") && (
              <TrackButton
                className="@max-lg:hidden"
                label="First page"
                testId="go-to-first-page"
                disabled={disabled || first}
                onClick={() => goTo(1)}
              >
                <KeyboardDoubleArrowLeftIcon size={Size.Sm} />
              </TrackButton>
            )}
            <TrackButton
              label="Previous page"
              testId="go-to-previous-page"
              disabled={disabled || first}
              onClick={() => goTo(page - 1)}
            >
              <KeyboardArrowLeftIcon size={Size.Sm} />
            </TrackButton>
            {shows("pages") &&
              items.map((item) =>
                typeof item === "number" ? (
                  <TrackButton
                    key={item}
                    className="@max-lg:hidden"
                    label={`Page ${item}`}
                    current={item === page}
                    disabled={disabled}
                    onClick={() => goTo(item)}
                  >
                    {item}
                  </TrackButton>
                ) : editing === item ? (
                  <Input
                    key={item}
                    // eslint-disable-next-line jsx-a11y/no-autofocus -- focus follows the user's click on the ellipsis
                    autoFocus
                    borderless
                    size={Size.Sm}
                    className="h-6 w-12 text-center tabular-nums"
                    inputMode="numeric"
                    aria-label="Go to page"
                    value={jump}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      /^\d*$/.test(e.target.value) && setJump(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        commitJump();
                        setEditing(null);
                      } else if (e.key === "Escape") setEditing(null);
                    }}
                    onBlur={() => setEditing(null)}
                  />
                ) : jumpMode !== PaginationJump.Input && shows("jump") ? (
                  <TrackButton
                    key={item}
                    className="@max-lg:hidden"
                    label="Jump to page"
                    disabled={disabled}
                    onClick={() => {
                      setJump("");
                      setEditing(item);
                    }}
                  >
                    …
                  </TrackButton>
                ) : (
                  <span
                    key={item}
                    aria-hidden
                    className={clsx(
                      "flex h-6 min-w-5 items-center justify-center @max-lg:hidden",
                      textStyles(TextVariant.BodyTertiary),
                      textColorClass(TextColor.Tertiary)
                    )}
                  >
                    …
                  </span>
                )
              )}
            <TrackButton
              label="Next page"
              testId="go-to-next-page"
              disabled={disabled || last}
              onClick={() => goTo(page + 1)}
            >
              <KeyboardArrowRightIcon size={Size.Sm} />
            </TrackButton>
            {shows("edges") && (
              <TrackButton
                className="@max-lg:hidden"
                label="Last page"
                testId="go-to-last-page"
                disabled={disabled || last}
                onClick={() => goTo(pageCount)}
              >
                <KeyboardDoubleArrowRightIcon size={Size.Sm} />
              </TrackButton>
            )}
          </div>
        )}

        {pageCount > JUMP_THRESHOLD &&
          shows("jump") &&
          jumpMode !== PaginationJump.Ellipsis && (
            <div className="flex items-center gap-2 @max-lg:hidden">
              <Text variant="body-tertiary" color={TextColor.Secondary}>
                Go to
              </Text>
              <Input
                size={Size.Sm}
                className="w-12 text-center tabular-nums"
                inputMode="numeric"
                aria-label="Go to page"
                value={jump}
                disabled={disabled}
                onChange={(e) =>
                  /^\d*$/.test(e.target.value) && setJump(e.target.value)
                }
                onKeyDown={onJumpKey}
                onBlur={commitJump}
              />
            </div>
          )}
      </div>
    </nav>
  );
};

interface TrackButtonProps {
  label: string;
  testId?: string;
  current?: boolean;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
  children: ReactNode;
}

const TrackButton: FC<TrackButtonProps> = ({
  label,
  testId,
  current = false,
  disabled,
  className,
  onClick,
  children,
}) => (
  <button
    type="button"
    aria-label={label}
    aria-current={current ? "page" : undefined}
    data-testid={testId}
    disabled={disabled}
    onClick={onClick}
    className={clsx(
      "inline-flex h-6 min-w-6 items-center justify-center px-1.5 tabular-nums",
      textStyles(TextVariant.BodyTertiary),
      radiusStyles(Radius.Sm),
      "transition-colors hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50",
      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid",
      current
        ? [
            bgColorClass(BackgroundColor.CardElevated),
            textColorClass(TextColor.Foreground),
          ]
        : [
            textColorClass(TextColor.Secondary),
            textColorClass(TextColor.Foreground, ElementState.Hover),
          ],
      className
    )}
  >
    {children}
  </button>
);

Pagination.displayName = "Pagination";
