import type {
  FC,
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import radiusStyles from "@/styles/radius";
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

/**
 * A styled data table.
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
 * @param className Additional CSS class names to apply to the table.
 * @param children The table sections.
 * @param props Additional HTML properties to apply to the table.
 */
export const Table: FC<HTMLAttributes<HTMLTableElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <table
      className={cn(
        "w-full border-collapse",
        bgColorClass(BackgroundColor.Card),
        radiusStyles(Radius.Md),
        className
      )}
      {...props}
    >
      {children}
    </table>
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
  return (
    <tr
      className={cn(
        "border-b last:border-0",
        borderColorClass(BorderColor.CardElevated),
        isClickable && "hover:cursor-pointer",
        isClickable &&
          bgColorClass(BackgroundColor.CardNested, ElementState.Hover),
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
  return (
    <thead
      className={cn(
        "border-b",
        borderColorClass(BorderColor.CardElevated),
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
 * ```
 */
export const TableCell: FC<TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <td
      className={cn(
        "px-6 py-3 text-left font-normal",
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
 * A header cell (`th`), in the secondary text color.
 *
 * @example
 * ```tsx
 * <TableHead scope="col">Status</TableHead>
 * ```
 */
export const TableHead: FC<ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left font-normal",
        textColorClass(TextColor.Secondary),
        textStyles(TextVariant.BodySecondary),
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

Table.displayName = "Table";
TableBody.displayName = "TableBody";
TableCell.displayName = "TableCell";
TableHead.displayName = "TableHead";
TableHeader.displayName = "TableHeader";
TableRow.displayName = "TableRow";
