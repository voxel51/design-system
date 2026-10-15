import {
  ChangeEvent,
  FC,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/Button";
import { Input, InputType } from "@/components/Input";
import { Select, SelectAnchor } from "@/components/Select";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  IconName,
  Radius,
  Size,
  TextColor,
  TextVariant,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";

export interface PaginationBarProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Zero-based index of the current page. */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total number of items across all pages. */
  total: number;
  onChange?: (page: number) => void;
  disabled?: boolean;
  formatLabel?: (start: number, end: number, total: number) => ReactNode;
  /** Render numbered page buttons near the start, current page, and end. */
  pageButtons?: boolean;
  /** Render an input for jumping to an arbitrary page. */
  pageInput?: boolean;
  /** Page size choices; renders a page size select when `onPageSizeChange` is also provided. */
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  /** Anchor for the page size select dropdown. See {@link SelectAnchor}. */
  pageSizeAnchor?: SelectAnchor;
}

const ELLIPSIS = "…";

/** Number of page buttons to keep at each end of the range. */
const BOUNDARY_COUNT = 2;

/** Number of page buttons to keep on each side of the current page. */
const SIBLING_COUNT = 1;

const DIGITS_ONLY_REGEX = /^[0-9]*$/;

const defaultFormatLabel = (
  start: number,
  end: number,
  total: number
): string =>
  total === 0 ? "Showing 0 of 0" : `Showing ${start}–${end} of ${total}`;

const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);

/**
 * Computes the one-based page buttons to render: pages near the start, pages
 * around the current page, and pages near the end, with ellipses standing in
 * for any gaps.
 */
const pageButtonRange = (
  current: number,
  count: number
): (number | typeof ELLIPSIS)[] => {
  const startPages = range(1, Math.min(BOUNDARY_COUNT, count));
  const endPages = range(
    Math.max(count - BOUNDARY_COUNT + 1, BOUNDARY_COUNT + 1),
    count
  );

  const siblingsStart = Math.max(
    Math.min(
      current - SIBLING_COUNT,
      count - BOUNDARY_COUNT - SIBLING_COUNT * 2 - 1
    ),
    BOUNDARY_COUNT + 2
  );
  const siblingsEnd = Math.min(
    Math.max(current + SIBLING_COUNT, BOUNDARY_COUNT + SIBLING_COUNT * 2 + 2),
    count - BOUNDARY_COUNT - 1
  );

  return [
    ...startPages,
    ...(siblingsStart > BOUNDARY_COUNT + 2
      ? [ELLIPSIS as typeof ELLIPSIS]
      : BOUNDARY_COUNT + 1 < count - BOUNDARY_COUNT
      ? [BOUNDARY_COUNT + 1]
      : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - BOUNDARY_COUNT - 1
      ? [ELLIPSIS as typeof ELLIPSIS]
      : count - BOUNDARY_COUNT > BOUNDARY_COUNT
      ? [count - BOUNDARY_COUNT]
      : []),
    ...endPages,
  ];
};

/**
 * A pagination bar with first/previous/next/last controls and a label
 * describing the visible range of a paginated collection. Numbered page
 * buttons, a jump-to-page input, and a page size select can each be enabled
 * independently.
 *
 * The component is presentational; the consumer owns the page state and is
 * notified of requested page changes via `onChange`. Out-of-range `page`
 * values are clamped into the valid range before rendering.
 *
 * @example
 * ```tsx
 * <PaginationBar
 *   page={page}
 *   pageSize={pageSize}
 *   total={113}
 *   onChange={setPage}
 *   pageButtons
 *   pageInput
 *   pageSizeOptions={[25, 50, 100]}
 *   onPageSizeChange={setPageSize}
 * />
 * ```
 *
 * @param page The zero-based index of the current page.
 * @param pageSize The number of items shown per page; values below 1 are treated as 1.
 * @param total The total number of items across all pages.
 * @param onChange Called with the requested zero-based page when a control is used.
 * @param disabled Boolean disabling all pagination controls.
 * @param formatLabel Optional formatter for the range label, receiving the one-based
 *  start and end item numbers and the total item count.
 * @param pageButtons Boolean enabling numbered page buttons near the start, the
 *  current page, and the end of the page range, with ellipses for any gaps.
 * @param pageInput Boolean enabling an input for jumping to an arbitrary page.
 * @param pageSizeOptions Page size choices; a page size select is rendered when
 *  `onPageSizeChange` is also provided. The current `pageSize` is always included.
 * @param onPageSizeChange Called with the requested page size.
 * @param pageSizeAnchor Anchor for the page size select dropdown. See {@link SelectAnchor}.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const PaginationBar: FC<PaginationBarProps> = ({
  page,
  pageSize,
  total,
  onChange,
  disabled = false,
  formatLabel = defaultFormatLabel,
  pageButtons = false,
  pageInput = false,
  pageSizeOptions,
  onPageSizeChange,
  pageSizeAnchor,
  className,
  ...props
}) => {
  const safePageSize = Math.max(1, pageSize);
  const maxPage = Math.max(0, Math.ceil(total / safePageSize) - 1);
  const safePage = Math.max(0, Math.min(page, maxPage));
  const pageCount = maxPage + 1;

  const start = total === 0 ? 0 : safePage * safePageSize + 1;
  const end = total === 0 ? 0 : Math.min((safePage + 1) * safePageSize, total);

  const [draftPage, setDraftPage] = useState(String(safePage + 1));

  useEffect(() => {
    setDraftPage(String(safePage + 1));
  }, [safePage]);

  const commitDraftPage = (): void => {
    const parsed = Number.parseInt(draftPage, 10);

    if (Number.isFinite(parsed)) {
      const next = Math.max(0, Math.min(parsed - 1, maxPage));
      setDraftPage(String(next + 1));
      if (next !== safePage) {
        onChange?.(next);
        return;
      }
    }

    setDraftPage(String(safePage + 1));
  };

  const sizeOptions = pageSizeOptions?.includes(safePageSize)
    ? pageSizeOptions
    : [...(pageSizeOptions ?? []), safePageSize].sort((a, b) => a - b);

  return (
    <nav
      aria-label="pagination"
      className={cn(
        "inline-flex items-center gap-x-md px-2.5 py-1.5",
        bgColorClass(BackgroundColor.Popover),
        radiusStyles(Radius.Md),
        className
      )}
      {...props}
    >
      {!!pageSizeOptions?.length && onPageSizeChange && (
        <Select
          exclusive
          className="w-20"
          aria-label="page size"
          anchor={pageSizeAnchor}
          disabled={disabled}
          options={sizeOptions.map((size) => ({
            id: String(size),
            data: { label: String(size) },
          }))}
          value={String(safePageSize)}
          onChange={(value) => {
            const parsed = Number.parseInt(
              Array.isArray(value) ? value[0] : value ?? "",
              10
            );
            if (Number.isFinite(parsed) && parsed !== safePageSize) {
              onPageSizeChange(parsed);
            }
          }}
        />
      )}

      <span className="inline-flex items-center gap-x-xs">
        <Button
          variant={Variant.Icon}
          size={Size.Sm}
          aria-label="first page"
          data-testid="go-to-first-page"
          leadingIcon={IconName.ChevronDoubleLeft}
          disabled={disabled || safePage === 0}
          onClick={() => onChange?.(0)}
        />
        <Button
          variant={Variant.Icon}
          size={Size.Sm}
          aria-label="previous page"
          data-testid="go-to-previous-page"
          leadingIcon={IconName.ChevronLeft}
          disabled={disabled || safePage === 0}
          onClick={() => onChange?.(safePage - 1)}
        />

        {pageButtons &&
          pageButtonRange(safePage + 1, pageCount).map((item, index) =>
            item === ELLIPSIS ? (
              <Text
                key={`ellipsis-${index}`}
                variant={TextVariant.Sm}
                color={TextColor.Tertiary}
              >
                {ELLIPSIS}
              </Text>
            ) : (
              <Button
                key={item}
                borderless
                variant={
                  item === safePage + 1 ? Variant.Primary : Variant.Borderless
                }
                size={Size.Sm}
                disabled={disabled}
                aria-current={item === safePage + 1 ? "page" : undefined}
                onClick={() => onChange?.(item - 1)}
              >
                {item}
              </Button>
            )
          )}

        <Button
          variant={Variant.Icon}
          size={Size.Sm}
          aria-label="next page"
          data-testid="go-to-next-page"
          leadingIcon={IconName.ChevronRight}
          disabled={disabled || safePage >= maxPage}
          onClick={() => onChange?.(safePage + 1)}
        />
        <Button
          variant={Variant.Icon}
          size={Size.Sm}
          aria-label="last page"
          data-testid="go-to-last-page"
          leadingIcon={IconName.ChevronDoubleRight}
          disabled={disabled || safePage >= maxPage}
          onClick={() => onChange?.(maxPage)}
        />
      </span>

      {pageInput && (
        <span className="inline-flex items-center gap-x-sm">
          <Input
            type={InputType.Text}
            size={Size.Sm}
            className="w-14 text-center"
            aria-label="page number"
            autoComplete="off"
            disabled={disabled}
            value={draftPage}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              DIGITS_ONLY_REGEX.test(event.target.value) &&
              setDraftPage(event.target.value)
            }
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) =>
              event.key === "Enter" && commitDraftPage()
            }
            onBlur={commitDraftPage}
          />
          <Text
            variant={TextVariant.Sm}
            color={TextColor.Secondary}
            className="whitespace-nowrap"
          >
            of {pageCount}
          </Text>
        </span>
      )}

      <Text
        variant={TextVariant.Sm}
        color={TextColor.Secondary}
        className="whitespace-nowrap"
      >
        {formatLabel(start, end, total)}
      </Text>
    </nav>
  );
};

PaginationBar.displayName = "PaginationBar";
