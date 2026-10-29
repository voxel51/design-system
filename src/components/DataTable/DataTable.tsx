import { createContext, Fragment, useContext } from "react";
import type {
  FC,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  SyntheticEvent,
} from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  Radius,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { BREAKPOINT_WIDTHS, type Breakpoint } from "@/util/breakpoints";
import { cn } from "@/util/classes";
import { OverflowRowCompactContext } from "@/util/compact";
import { useElementSize } from "@/util/useElementSize";

/** A column of a {@link DataTable}. */
export type DataTableColumn = {
  /** Key of this column's cell in each row's `cells`. */
  key: string;
  /** Header text; in card mode it labels `meta` values. */
  label: ReactNode;
  /**
   * Place of the column in card mode: `"primary"` is the card title,
   * `"status"` sits beside it, `"actions"` at its end and `"meta"` (default)
   * on the line below as `Label: value`.
   */
  role?: "primary" | "status" | "meta" | "actions";
  /** Hides the column (header and cells) on windows narrower than this. Wide mode only. */
  hideBelow?: Breakpoint;
  align?: "start" | "end";
  /**
   * Column width in wide mode: a length such as `"16rem"`; `"fit"` hugs the
   * content without wrapping; `"fill"` takes the free space and truncates
   * first. Give the `primary` column `"fill"` and the others `"fit"` for a
   * row of one flexible card then compact cells.
   */
  width?: string;
};

/** A row of a {@link DataTable}. */
export type DataTableRow = {
  id: string;
  /** Cell content keyed by column `key`. */
  cells: Record<string, ReactNode>;
  /** Called on a click or Enter on the row; the event tells e.g. a ⌘-click to open in a new tab. */
  onClick?: (event: SyntheticEvent) => void;
  /** Spread onto the row (`tr`, or the card in card mode), e.g. `data-cy`. */
  props?: HTMLAttributes<HTMLTableRowElement>;
  /**
   * Content shown under the row, full width (e.g. an expanded row's
   * details); in card mode at the end of the card. Clicks in it do not
   * reach `onClick`.
   */
  detail?: ReactNode;
};

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  /** Shown in place of the rows when there are none. */
  empty?: ReactNode;
  /** The table shows cards while it is narrower than this. Defaults to `"sm"`. */
  cardBelow?: Breakpoint;
  className?: string;
  /** Names the table for assistive technology. */
  "aria-label"?: string;
  /**
   * More rows, as {@link DataTableRowItem} elements: for a row which needs
   * hooks or state of its own. They follow `rows`.
   */
  children?: ReactNode;
}

const hideBelowStyles: Record<Breakpoint, string> = {
  sm: "max-sm:hidden",
  md: "max-md:hidden",
  lg: "max-lg:hidden",
  xl: "max-xl:hidden",
};

const COMPACT = { compact: true, labelMax: null };

const widthClass = (width?: string): string | undefined =>
  width === "fit"
    ? "w-px whitespace-nowrap"
    : width === "fill"
      ? "w-full max-w-0"
      : undefined;

const widthStyle = (
  width?: string
): { width: string; minWidth: string } | undefined =>
  width && width !== "fit" && width !== "fill"
    ? { width, minWidth: width }
    : undefined;

const DataTableContext = createContext<{
  columns: DataTableColumn[];
  card: boolean;
} | null>(null);

const stop = (e: SyntheticEvent): void => e.stopPropagation();

const hasValue = (value: ReactNode): boolean =>
  value !== null && value !== undefined && value !== false && value !== "";

const rowKeyDown =
  (row: DataTableRow) =>
  (e: KeyboardEvent<HTMLElement>): void => {
    row.props?.onKeyDown?.(e as KeyboardEvent<HTMLTableRowElement>);
    if (e.key === "Enter" && e.target === e.currentTarget) row.onClick?.(e);
  };

const clickableProps = (row: DataTableRow): HTMLAttributes<HTMLElement> =>
  row.onClick
    ? { onClick: row.onClick, onKeyDown: rowKeyDown(row), tabIndex: 0 }
    : {};

const cellClass = (column: DataTableColumn): string =>
  cn(
    widthClass(column.width),
    column.hideBelow && hideBelowStyles[column.hideBelow],
    column.align === "end" && "text-right"
  );

const WideRow: FC<{ columns: DataTableColumn[]; row: DataTableRow }> = ({
  columns,
  row,
}) => (
  <Fragment>
    <TableRow {...row.props} {...clickableProps(row)}>
      {columns.map((column) => (
        <TableCell
          key={column.key}
          className={cn(
            column.width !== "fit" && "wrap-anywhere",
            cellClass(column)
          )}
          style={widthStyle(column.width)}
          {...(column.role === "actions" && {
            onClick: stop,
            onKeyDown: stop,
          })}
        >
          {row.cells[column.key]}
        </TableCell>
      ))}
    </TableRow>
    {hasValue(row.detail) && (
      <TableRow>
        <TableCell colSpan={columns.length} className="p-0">
          {row.detail}
        </TableCell>
      </TableRow>
    )}
  </Fragment>
);

const WideTable: FC<Omit<DataTableProps, "cardBelow">> = ({
  columns,
  rows,
  empty,
  className,
  children,
  "aria-label": ariaLabel,
}) => {
  return (
    <Table className={className} aria-label={ariaLabel}>
      {columns.some((column) => hasValue(column.label)) && (
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                scope="col"
                className={cellClass(column)}
                style={widthStyle(column.width)}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {rows.length === 0 && empty !== undefined ? (
          <TableRow>
            <TableCell colSpan={columns.length}>{empty}</TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <WideRow key={row.id} columns={columns} row={row} />
          ))
        )}
        {children}
      </TableBody>
    </Table>
  );
};

const Card: FC<{ columns: DataTableColumn[]; row: DataTableRow }> = ({
  columns,
  row,
}) => {
  const cells = (role: DataTableColumn["role"]): DataTableColumn[] =>
    columns.filter(
      (column) =>
        (column.role ?? "meta") === role && hasValue(row.cells[column.key])
    );
  const actions = cells("actions");
  const meta = cells("meta");
  return (
    <div
      {...row.props}
      {...clickableProps(row)}
      className={cn(
        "flex flex-col gap-xs border-b p-3 last:border-0",
        "border-content-border-default/30",
        row.onClick && "hover:cursor-pointer",
        row.onClick &&
          bgColorClass(BackgroundColor.CardNested, ElementState.Hover),
        row.props?.className
      )}
    >
      <div className="flex items-center gap-sm">
        <div
          className={cn(
            "min-w-0 flex-1",
            textColorClass(TextColor.Primary),
            textStyles(TextVariant.BodySecondary)
          )}
        >
          {cells("primary").map((column) => {
            const value = row.cells[column.key];
            return typeof value === "string" ? (
              <Text key={column.key} truncate className="block">
                {value}
              </Text>
            ) : (
              <div key={column.key} className="min-w-0 wrap-anywhere">
                {value}
              </div>
            );
          })}
        </div>
        {cells("status").map((column) => (
          <div key={column.key} className="shrink-0">
            {row.cells[column.key]}
          </div>
        ))}
        {actions.length > 0 && (
          <div
            role="presentation"
            className="flex shrink-0 items-center gap-xs"
            onClick={stop}
            onKeyDown={stop}
          >
            <OverflowRowCompactContext.Provider value={COMPACT}>
              {actions.map((column) => (
                <div key={column.key}>{row.cells[column.key]}</div>
              ))}
            </OverflowRowCompactContext.Provider>
          </div>
        )}
      </div>
      {meta.length > 0 && (
        <div
          className={cn(
            "flex flex-wrap items-baseline gap-x-md gap-y-xs wrap-anywhere",
            textColorClass(TextColor.Primary),
            textStyles(TextVariant.Caption)
          )}
        >
          {meta.map((column) => (
            <div
              key={column.key}
              className="flex min-w-0 items-baseline gap-xs"
            >
              {hasValue(column.label) && (
                <span
                  className={cn(
                    "flex shrink-0",
                    textColorClass(TextColor.Secondary)
                  )}
                >
                  {column.label}:
                </span>
              )}
              <div className="min-w-0">{row.cells[column.key]}</div>
            </div>
          ))}
        </div>
      )}
      {hasValue(row.detail) && (
        <div role="presentation" onClick={stop} onKeyDown={stop}>
          {row.detail}
        </div>
      )}
    </div>
  );
};

/**
 * A table built from a column model. While the table itself is narrower
 * than `cardBelow` (by its own width, so a table in a narrow pane also
 * changes), each row shows as a card: the `primary` cell as title with
 * `status` beside it and `actions` (icon-only) at the end, then the `meta`
 * cells as wrapping `Label: value` items. Empty meta values are skipped.
 * A row's `detail` (e.g. expanded details) shows full width under it.
 *
 * Clicks and Enter in an `actions` cell or a `detail` do not reach the
 * row's `onClick`.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: "name", label: "Name", role: "primary" },
 *     { key: "status", label: "Status", role: "status" },
 *     { key: "updated", label: "Updated", hideBelow: "md" },
 *     { key: "menu", label: "", role: "actions", align: "end" },
 *   ]}
 *   rows={runs.map((run) => ({
 *     id: run.id,
 *     cells: { name: run.name, status: <RunStatus run={run} />, updated: run.updated, menu: <RunMenu run={run} /> },
 *     onClick: () => openRun(run.id),
 *     props: { "data-cy": "run-row" } as HTMLAttributes<HTMLTableRowElement>,
 *   }))}
 *   empty="No runs yet"
 * />
 * ```
 *
 * @param columns The columns, in wide-mode order. See {@link DataTableColumn}.
 * @param rows The rows. See {@link DataTableRow}.
 * @param empty Shown in place of the rows when there are none.
 * @param cardBelow Breakpoint under which the table shows cards. Defaults to `"sm"` (640px).
 * @param className Additional CSS class names for the table, or the box holding the cards.
 * @param aria-label Names the table for assistive technology.
 * @param children More rows as {@link DataTableRowItem} elements, for rows with hooks or state.
 */
export const DataTable: FC<DataTableProps> = ({
  columns,
  rows,
  empty,
  cardBelow = "sm",
  className,
  children,
  "aria-label": ariaLabel,
}) => {
  const { ref, width } = useElementSize();
  const card = width > 0 && width < BREAKPOINT_WIDTHS[cardBelow];
  return (
    <DataTableContext.Provider value={{ columns, card }}>
      <div ref={ref} className="w-full">
        {card ? (
          <div
            role={ariaLabel ? "group" : undefined}
            aria-label={ariaLabel}
            className={cn(
              bgColorClass(BackgroundColor.Card),
              radiusStyles(Radius.Md),
              className
            )}
          >
            {rows.length === 0 && empty !== undefined ? (
              <div className="p-3">{empty}</div>
            ) : (
              rows.map((row) => (
                <Card key={row.id} columns={columns} row={row} />
              ))
            )}
            {children}
          </div>
        ) : (
          <WideTable
            columns={columns}
            rows={rows}
            empty={empty}
            className={className}
            aria-label={ariaLabel}
          >
            {children}
          </WideTable>
        )}
      </div>
    </DataTableContext.Provider>
  );
};

/**
 * A row of a {@link DataTable}, rendered as a table row or a card to match
 * the table. Use it as a child of `DataTable` when a row needs hooks or state
 * of its own; its props are those of a {@link DataTableRow}, without `id`.
 *
 * @example
 * ```tsx
 * const RunRow = ({ run }: { run: Run }) => {
 *   const [open, setOpen] = useState(false);
 *   return <DataTableRowItem cells={{ name: run.name, menu: <Menu open={open} /> }} />;
 * };
 *
 * <DataTable columns={columns} rows={[]}>
 *   {runs.map((run) => <RunRow key={run.id} run={run} />)}
 * </DataTable>
 * ```
 */
export const DataTableRowItem: FC<Omit<DataTableRow, "id">> = (row) => {
  const context = useContext(DataTableContext);
  if (!context) throw new Error("DataTableRowItem must be inside a DataTable");
  return context.card ? (
    <Card columns={context.columns} row={{ id: "", ...row }} />
  ) : (
    <WideRow columns={context.columns} row={{ id: "", ...row }} />
  );
};
DataTableRowItem.displayName = "DataTableRowItem";

DataTable.displayName = "DataTable";
