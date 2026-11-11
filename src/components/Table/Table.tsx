import {
  createContext,
  type FC,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  useContext,
} from "react";

import { ArrowUpDownIcon } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import { RULE_BORDER } from "@/styles/rule";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Radius,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

/** `"boxed"`: a bordered card with a tinted, sentence-case header row and tighter cells. `"plain"`: the default table with a sentence-case, secondary-color header. */
export const TableVariant = {
  Default: "default",
  Boxed: "boxed",
  Plain: "plain",
} as const;
export type TableVariant =
  `${(typeof TableVariant)[keyof typeof TableVariant]}`;

/** Horizontal alignment of a cell; `"end"` also uses tabular figures, for numbers. */
export const TableAlign = {
  Start: "start",
  End: "end",
} as const;
export type TableAlign = `${(typeof TableAlign)[keyof typeof TableAlign]}`;

/** Sort state of a sortable header cell. */
export const TableSort = {
  Asc: "asc",
  Desc: "desc",
  None: "none",
} as const;
export type TableSort = `${(typeof TableSort)[keyof typeof TableSort]}`;

const TableVariantContext = createContext<TableVariant>(TableVariant.Default);

const alignClass = (align?: TableAlign): string =>
  align === TableAlign.End ? "text-right tabular-nums" : "text-left";

const ARIA_SORT = {
  [TableSort.Asc]: "ascending",
  [TableSort.Desc]: "descending",
  [TableSort.None]: "none",
} as const;

/**
 * A styled data table. It scrolls sideways inside its own box when the
 * columns are wider than the space it has.
 *
 * Compose it from {@link TableHeader}, {@link TableBody}, {@link TableRow},
 * {@link TableHead} and {@link TableCell}. Each renders its native table
 * element, so any HTML table attribute passes through.
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow onClick={() => openRun(run.id)}>
 *       <TableCell>{run.name}</TableCell>
 *       <TableCell>{run.status}</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 *
 * @param variant `"default"`, `"boxed"` or `"plain"`. `"boxed"` draws the table as a bordered
 *  card with a tinted header row in sentence case and tighter cells. See {@link TableVariant}.
 * @param className Additional CSS class names to apply to the table.
 * @param wrapperClassName Additional CSS class names to apply to the scroll box around the table.
 * @param children The table sections.
 * @param props Additional HTML properties to apply to the table.
 */
export const Table: FC<
  HTMLAttributes<HTMLTableElement> & {
    wrapperClassName?: string;
    variant?: TableVariant;
  }
> = ({
  children,
  className,
  wrapperClassName,
  variant = TableVariant.Default,
  ...props
}) => {
  const boxed = variant === TableVariant.Boxed;
  return (
    <TableVariantContext.Provider value={variant}>
      <div
        className={cn(
          "w-full overflow-x-auto",
          boxed && "border-1",
          boxed && borderColorClass(BorderColor.Subtle),
          boxed && radiusStyles(Radius.Md),
          wrapperClassName
        )}
      >
        <table
          className={cn(
            "w-full border-collapse",
            bgColorClass(
              boxed ? BackgroundColor.CardNested : BackgroundColor.Card
            ),
            !boxed && radiusStyles(Radius.Md),
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    </TableVariantContext.Provider>
  );
};

/**
 * A table row. A row with an `onClick` gets a pointer cursor and a hover
 * highlight; a row without one stays static.
 *
 * @example
 * ```tsx
 * <TableRow onClick={() => openRun(run.id)}>
 *   <TableCell>{run.name}</TableCell>
 * </TableRow>
 * ```
 */
export const TableRow: FC<HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className,
  ...props
}) => {
  const isClickable = typeof props.onClick === "function";
  const boxed = useContext(TableVariantContext) === TableVariant.Boxed;
  return (
    <tr
      className={cn(
        "border-b last:border-0",
        RULE_BORDER,
        isClickable && "hover:cursor-pointer",
        isClickable &&
          bgColorClass(
            boxed ? BackgroundColor.CardElevated : BackgroundColor.CardNested,
            ElementState.Hover
          ),
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

/**
 * The table's header section (`thead`), with a divider below it.
 *
 * @example
 * ```tsx
 * <TableHeader>
 *   <TableRow>
 *     <TableHead>Name</TableHead>
 *   </TableRow>
 * </TableHeader>
 * ```
 */
export const TableHeader: FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  const boxed = useContext(TableVariantContext) === TableVariant.Boxed;
  return (
    <thead
      className={cn(
        "border-b",
        RULE_BORDER,
        boxed && bgColorClass(BackgroundColor.CardElevated),
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

/**
 * The table's body section (`tbody`).
 *
 * @example
 * ```tsx
 * <TableBody>
 *   {runs.map((run) => (
 *     <TableRow key={run.id}>
 *       <TableCell>{run.name}</TableCell>
 *     </TableRow>
 *   ))}
 * </TableBody>
 * ```
 */
export const TableBody: FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  ...props
}) => {
  return <tbody {...props}>{children}</tbody>;
};

/**
 * A body cell (`td`), in the primary text color.
 *
 * @example
 * ```tsx
 * <TableCell colSpan={2}>{run.name}</TableCell>
 * <TableCell align="end">{run.count}</TableCell>
 * ```
 *
 * @param align `"start"` (default) or `"end"`; `"end"` right-aligns with tabular figures. See {@link TableAlign}.
 */
export const TableCell: FC<
  Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> & { align?: TableAlign }
> = ({ children, className, align, ...props }) => {
  const boxed = useContext(TableVariantContext) === TableVariant.Boxed;
  return (
    <td
      className={cn(
        boxed ? "px-3 py-2" : "px-4 py-3",
        alignClass(align),
        "font-normal",
        textColorClass(TextColor.Primary),
        textStyles(TextVariant.BodySecondary),
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};

/**
 * A header cell (`th`): an uppercase label in the tertiary text color, or in a
 * `"boxed"` table a sentence-case caption in the secondary color. With
 * `onSort` its label becomes a sort button with an up/down icon, in the
 * primary color while it is the active sort.
 *
 * @example
 * ```tsx
 * <TableHead scope="col">Status</TableHead>
 * <TableHead align="end" sort="desc" onSort={() => toggle("support")}>
 *   Support
 * </TableHead>
 * ```
 *
 * @param align `"start"` (default) or `"end"`. See {@link TableAlign}.
 * @param sort The column's sort state; `"asc"` and `"desc"` mark it active. See {@link TableSort}.
 * @param onSort Makes the header's label a sort button, called when it is pressed.
 */
export const TableHead: FC<
  Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> & {
    align?: TableAlign;
    sort?: TableSort;
    onSort?: () => void;
  }
> = ({ children, className, align, sort, onSort, ...props }) => {
  const variant = useContext(TableVariantContext);
  const boxed = variant === TableVariant.Boxed;
  const sentence = boxed || variant === TableVariant.Plain;
  const sorted = sort === TableSort.Asc || sort === TableSort.Desc;
  return (
    <th
      className={cn(
        boxed ? "px-3 py-2 font-normal" : "px-4 py-2.5",
        alignClass(align),
        textStyles(sentence ? TextVariant.Caption : TextVariant.Label),
        sentence && !boxed && "font-medium",
        textColorClass(
          sorted
            ? TextColor.Primary
            : sentence
              ? TextColor.Secondary
              : TextColor.Tertiary
        ),
        className
      )}
      aria-sort={sort || onSort ? ARIA_SORT[sort ?? TableSort.None] : undefined}
      {...props}
    >
      {onSort ? (
        <button
          type="button"
          className={cn(
            "inline-flex cursor-pointer select-none items-center gap-1",
            align === TableAlign.End && "w-full justify-end"
          )}
          onClick={onSort}
        >
          {children}
          <ArrowUpDownIcon aria-hidden size={12} className="opacity-60" />
        </button>
      ) : (
        children
      )}
    </th>
  );
};

Table.displayName = "Table";
TableBody.displayName = "TableBody";
TableCell.displayName = "TableCell";
TableHead.displayName = "TableHead";
TableHeader.displayName = "TableHeader";
TableRow.displayName = "TableRow";
