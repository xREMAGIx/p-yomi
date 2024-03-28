import { mapModifiers } from "@client/libs/functions";
import React from "react";
import "./index.scss";

interface TableRowProps extends React.TableHTMLAttributes<HTMLTableRowElement> {
  isHead?: boolean;
}

interface TableCellProps
  extends React.TableHTMLAttributes<HTMLTableCellElement> {
  isHead?: boolean;
  colSpan?: number;
  rowSpan?: number;
  customPaddingY?: "smaller-y" | "sm-y";
  customPaddingX?: "sm-x";
  classModify?: string;
}
type TableModifiers = "primary" | "firstColSticky";

interface TableProps {
  theme?: "light" | "dark";
  classModifiers?: string;
  modifiers?: TableModifiers | TableModifiers[];
  header?: React.ReactNode;
  spacing?: boolean;
  children?: React.ReactNode;
}

interface TableHeaderProps {
  children?: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({
  isHead,
  children,
  ...props
}) => (
  <tr className={isHead ? "o-table_header_row" : "o-table_body_row"} {...props}>
    {children}
  </tr>
);

export const TableCell: React.FC<TableCellProps> = ({
  isHead,
  children,
  customPaddingY,
  customPaddingX,
  classModify,
  ...props
}) => {
  const Element = isHead ? "th" : "td";
  return (
    <Element
      {...props}
      className={`${mapModifiers(isHead ? "o-table_header_cell" : "o-table_body_cell", customPaddingY, customPaddingX, props.onClick && "cursor")} ${classModify || ""}`}
    >
      {children}
    </Element>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => (
  <thead className="o-table_header">{children}</thead>
);

const Table: React.FC<TableProps> = ({
  theme,
  classModifiers,
  header,
  children,
  modifiers,
  spacing,
}) => (
  <div
    className={mapModifiers(
      "o-table",
      theme,
      classModifiers,
      modifiers,
      spacing && "spacing"
    )}
  >
    <table className="o-table_wrap">
      {header}
      <tbody>{children}</tbody>
    </table>
  </div>
);

Table.defaultProps = {
  classModifiers: "",
  theme: "light",
  header: undefined,
  modifiers: undefined,
  spacing: undefined,
};

TableRow.defaultProps = {
  isHead: undefined,
};

TableCell.defaultProps = {
  isHead: undefined,
  colSpan: undefined,
  rowSpan: undefined,
};

export default Table;
