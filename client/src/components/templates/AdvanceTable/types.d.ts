import { TableTextAlign } from "@client/components/organisms/Table";

export interface SearchForm {
  search: string;
}

export interface ColumnType {
  id: string;
  keyValue: string;
  title: string;
  isShow: boolean;
}

export interface FilterForm<T> {
  sort: {
    keyVal: string;
    type: "asc" | "desc";
  } | null;
  [keyVal: keyof T]: string;
}

export interface SortForm {
  sortBy: string;
  sortOrder: "desc" | "asc";
}

export type AdvanceTableColumnType<T> = {
  colId: string;
  colKeyValue: keyof T;
  title?: string;
  textAlign?: TableTextAlign;
  isShow?: boolean;
  renderCell?: (cellVal: T) => React.ReactNode;
};
