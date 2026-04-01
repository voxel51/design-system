import type { FC, HTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Radius,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export const Table: FC<HTMLAttributes<HTMLTableElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <table
      className={cn(
        "w-full border-collapse",
        bgColorClass(BackgroundColor.Card1),
        radiusStyles(Radius.Md),
        className
      )}
      {...props}
    >
      {children}
    </table>
  );
};

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
        isClickable &&
          `hover:cursor-pointer hover:bg-[var(--color-content-bg-card-2)]`,
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

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

export const TableBody: FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  ...props
}) => {
  return <tbody {...props}>{children}</tbody>;
};

export const TableCell: FC<HTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <td
      className={cn(
        "px-6 py-3 text-left font-normal",
        textColorClass(TextColor.Primary),
        textStyles(TextVariant.Md),
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};

export const TableHead: FC<HTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left font-normal",
        textColorClass(TextColor.Secondary),
        textStyles(TextVariant.Md),
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
