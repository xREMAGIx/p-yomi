import Button from "@client/components/atoms/Button";
import Checkbox from "@client/components/atoms/Checkbox";
import Icon from "@client/components/atoms/Icon";
import Input from "@client/components/atoms/Input";
import Text from "@client/components/atoms/Text";
import Pagination from "@client/components/molecules/Pagination";
import Popper, { PopperRef } from "@client/components/molecules/Popper";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import { DEFAULT_PAGINATION } from "@client/libs/constants";
import { commafy } from "@client/libs/functions";
import { useTranslation } from "@client/libs/translation";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { TableFilter } from "./filter";
import { AdvanceTableColumnType, FilterForm, SortForm } from "./types";

interface AdvanceTableProps<T> {
  isLoading?: boolean;
  headerData: AdvanceTableColumnType<T>[];
  data: T[];
  sortKeys?: string[];
  inlineSearchKeys?: string[];
  handleEditRecord?: (record: T) => void;
  handleDeleteRecord?: (record: T) => void;
  handleSearchText?: (searchText: string) => void;
  handleSortParams?: (sortParams: SortForm) => void;
  handleSelectRecord?: (record: T) => void;
  handleCheckedRecords?: (records: T[]) => void;
}

export interface AdvanceTableRef {}

function AdvanceTableFc<T extends { id: number }>(
  {
    isLoading,
    data,
    headerData,
    sortKeys,
    inlineSearchKeys,
    handleEditRecord,
    handleDeleteRecord,
    handleSearchText,
    handleSortParams,
    handleSelectRecord,
    handleCheckedRecords,
  }: AdvanceTableProps<T>,
  ref: React.ForwardedRef<AdvanceTableRef>
) {
  //* Hooks
  const { t } = useTranslation();

  //* States
  const [pagination, setPagination] = useState({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });
  const [columns, setColumns] = useState<AdvanceTableColumnType<T>[]>(
    headerData.map((ele) => ({
      ...ele,
      colId: ele.colId,
      colKeyValue: ele.colKeyValue,
      title: ele.title,
      isShow: true,
    }))
  );
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [stickyCols, setStickyCols] = useState<string[]>([]);

  //* Refs
  const tableRef = useRef<HTMLDivElement | null>(null);

  //* Hook-form
  const filterMethods = useForm<FilterForm<T>>();

  //* Query

  //* Mutations

  //* Memos

  //* Functions
  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page: page }));
  };

  const handleSearch = (searchText: string) => {
    if (!handleSearchText) return;
    handleSearchText(searchText);
  };

  const handleSort = (form: SortForm) => {
    if (!handleSortParams) return;
    handleSortParams(form);
  };

  const handleCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>,
    record: T
  ) => {
    if (e.target.checked) {
      const newSelectedRows = [...selectedRows, record];
      setSelectedRows(newSelectedRows);
      handleCheckedRecords && handleCheckedRecords(newSelectedRows);
      return;
    }
    const newSelectedRows = selectedRows.filter((ele) => ele.id !== record.id);
    setSelectedRows(newSelectedRows);
    handleCheckedRecords && handleCheckedRecords(newSelectedRows);
  };

  const handleCheckboxAll = () => {
    if (!data) return;
    if (selectedRows.length !== data.length) {
      setSelectedRows(data);
      handleCheckedRecords && handleCheckedRecords(data);
      return;
    }
    setSelectedRows([]);
    handleCheckedRecords && handleCheckedRecords([]);
  };

  const handleStickyCol = ({
    keyVal,
    colIdx,
  }: {
    keyVal: string;
    colIdx: number;
  }) => {
    if (!tableRef.current) return;

    if (stickyCols.includes(keyVal)) {
      const cellList = Array.from(
        tableRef.current.querySelectorAll<HTMLElement>(
          `[data-sticky-col="${colIdx}"]`
        )
      );
      cellList.forEach((ele) => {
        ele.removeAttribute("style");
      });
      setStickyCols((prev) => prev.filter((ele) => ele !== keyVal));
    } else {
      setStickyCols((prev) => [...prev, keyVal]);
    }
  };

  //* Imperative hanlder
  useImperativeHandle(ref, () => ({}));

  //* Effects
  useEffect(() => {
    if (!tableRef.current) return;
    const cellList = Array.from(
      tableRef.current.querySelectorAll<HTMLElement>("[data-sticky-col]")
    );
    cellList.forEach((ele) => {
      ele.removeAttribute("style");
    });

    const headerCellList = cellList.filter((ele) => ele.tagName === "TH");

    const stickyAttrArr = headerCellList.reduce(
      (
        prev: {
          dataAttrIdx: string;
          currOffset: number;
          nextOffset: number;
        }[],
        curr,
        idx
      ) => {
        return [
          ...prev,
          {
            dataAttrIdx: curr.getAttribute("data-sticky-col") ?? "",
            currOffset: idx > 0 ? prev[idx - 1].nextOffset : 0,
            nextOffset:
              (idx > 0 ? prev[idx - 1].nextOffset : 0) + curr.clientWidth,
          },
        ];
      },
      []
    );
    cellList.forEach((ele) => {
      const colIdx = ele.getAttribute("data-sticky-col");
      const cellStickyType = ele.getAttribute("data-sticky-type");

      const stickyAttr = stickyAttrArr.find(
        (item) => item.dataAttrIdx === colIdx
      );

      if (!stickyAttr) return;

      ele.style.position = "sticky";
      ele.style.left = `${stickyAttr.currOffset}px`;

      if (cellStickyType && cellStickyType === "header") {
        ele.style.zIndex = "2";
      } else {
        ele.style.zIndex = "1";
      }
    });
  }, [stickyCols]);

  return (
    <div className="t-advanceTable">
      <div className="t-advanceTable_filter">
        <TableFilter
          columns={columns}
          sortKeys={sortKeys}
          handleSearch={handleSearch}
          handleChangeShowCol={setColumns}
          handleSort={handleSort}
        />
      </div>
      <div className="t-advanceTable_table u-m-t-32" ref={tableRef}>
        <FormProvider {...filterMethods}>
          <Table
            isLoading={isLoading}
            header={
              <TableHeader>
                <TableRow isHead>
                  {handleCheckedRecords && (
                    <TableCell isHead>
                      <Checkbox
                        id="check-all"
                        checked={selectedRows.length === data?.length}
                        onChange={handleCheckboxAll}
                      />
                    </TableCell>
                  )}
                  {(handleEditRecord || handleDeleteRecord) && (
                    <TableCell
                      key={`table-header-action`}
                      isHead
                      {...(stickyCols.includes(`action`) && {
                        ["data-sticky-type"]: "header",
                        ["data-sticky-col"]: "action",
                      })}
                    >
                      <span>{t(`table.action`)}</span>
                    </TableCell>
                  )}
                  {columns.map((ele: AdvanceTableColumnType<T>, colIdx) => {
                    if (!ele.isShow) return;
                    const keyVal = String(ele.colKeyValue);
                    const isStickyCol = stickyCols.includes(keyVal);

                    return (
                      <TableCell
                        key={ele.colId}
                        isHead
                        {...(ele.textAlign && { textAlign: ele.textAlign })}
                        {...(isStickyCol && {
                          ["data-sticky-type"]: "header",
                          ["data-sticky-col"]: colIdx,
                        })}
                      >
                        <div className="u-d-flex u-flex-ai-center u-flex-jc-between">
                          <span>{t(`table.${keyVal}`)}</span>
                          <TableColumnSetting
                            keyVal={keyVal}
                            colIdx={colIdx}
                            isStickyCol={isStickyCol}
                            handleStickyCol={handleStickyCol}
                          />
                        </div>
                        <div className="o-table_header_icon u-d-flex u-flex-ai-center">
                          {isStickyCol && <Icon iconName="pin" size="12" />}
                          <Controller
                            control={filterMethods.control}
                            name="sort"
                            render={({ field }) => {
                              if (
                                !field.value ||
                                field.value.keyVal !== ele.colKeyValue
                              )
                                return <></>;

                              return (
                                <div className="u-m-l-4">
                                  <Icon
                                    iconName={
                                      field.value.type === "asc"
                                        ? "sortAsc"
                                        : "sortDesc"
                                    }
                                    size="12"
                                  />
                                </div>
                              );
                            }}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
                {!!inlineSearchKeys?.length && (
                  <TableRow>
                    {handleCheckedRecords && (
                      <TableCell
                        key={`table-header-filter-checkbox`}
                      ></TableCell>
                    )}
                    {(handleEditRecord || handleDeleteRecord) && (
                      <TableCell
                        key={`table-header-filter-action`}
                        {...(stickyCols.includes(`action`) && {
                          ["data-sticky-col"]: "action",
                        })}
                      ></TableCell>
                    )}
                    {headerData.map((ele, colIdx) => {
                      const keyVal = String(ele.colKeyValue);
                      const isStickyCol = stickyCols.includes(keyVal);

                      return (
                        <TableCell
                          key={`table-header-filter-${keyVal}`}
                          modifiers={["noPadding"]}
                          {...(isStickyCol && {
                            ["data-sticky-col"]: colIdx,
                          })}
                        >
                          {inlineSearchKeys.includes(
                            ele.colKeyValue as string
                          ) ? (
                            <Controller
                              control={filterMethods.control}
                              //TODO: Recheck type
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              name={keyVal as any}
                              defaultValue={""}
                              render={({ field, fieldState: { error } }) => (
                                <Input
                                  id={`table-header-filter-input-${keyVal}`}
                                  {...field}
                                  error={error?.message}
                                />
                              )}
                            />
                          ) : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                )}
              </TableHeader>
            }
          >
            <TableContent
              haveCheckboxes={!!handleCheckedRecords}
              selectedRows={selectedRows}
              stickyCols={stickyCols}
              headerData={columns}
              data={data ?? []}
              handleSelectRecord={handleSelectRecord}
              handleCheckbox={handleCheckbox}
              handleEditRecord={handleEditRecord}
              handleDeleteRecord={handleDeleteRecord}
            />
          </Table>
        </FormProvider>
      </div>
      <div className="u-m-t-32">
        <Pagination
          currentPage={pagination.page}
          totalPage={pagination.totalPages}
          getPageNumber={handleChangePage}
        />
      </div>
    </div>
  );
}

//TODO: Think about React.memo generic type
const AdvanceTable = forwardRef(AdvanceTableFc) as <T>(
  props: AdvanceTableProps<T> & { ref?: React.ForwardedRef<AdvanceTableRef> }
) => ReturnType<typeof AdvanceTableFc>;

export default AdvanceTable;

interface TableContentProps<T> {
  haveCheckboxes?: boolean;
  selectedRows: T[];
  stickyCols: string[];
  headerData: AdvanceTableColumnType<T>[];
  data: T[];
  selectedRecord?: T;
  handleSelectRecord?: (record: T) => void;
  handleDeleteRecord?: (record: T) => void;
  handleEditRecord?: (record: T) => void;
  handleCheckbox?: (e: React.ChangeEvent<HTMLInputElement>, record: T) => void;
}

const TableContent = <T extends { id: number }>({
  haveCheckboxes,
  selectedRows,
  stickyCols,
  headerData,
  data,
  selectedRecord,
  handleSelectRecord,
  handleCheckbox,
  handleEditRecord,
  handleDeleteRecord,
}: TableContentProps<T>) => {
  //* Hooks

  //* Hook-form
  const filterMethods = useFormContext<FilterForm<T>>();
  const filter = useWatch({ control: filterMethods.control });

  const filteredRecords = useMemo(() => {
    let result = [...data];
    const { sort, ...filtesObj } = filter;

    if (sort && sort?.keyVal && sort.type) {
      result = result.sort((a, b) => {
        const firstEl = a[sort.keyVal as keyof typeof a];
        const secondEl = b[sort.keyVal as keyof typeof b];

        if (typeof firstEl === "number" && typeof secondEl === "number") {
          if (sort.type === "desc") {
            return secondEl - firstEl;
          }
          return firstEl - secondEl;
        }

        if (sort.type === "desc") {
          return ("" + secondEl)?.localeCompare("" + firstEl);
        }
        return ("" + firstEl)?.localeCompare("" + secondEl);
      });
    }

    Object.keys(filtesObj).forEach((filterKey) => {
      if (filterKey) {
        result = result.filter((ele) => {
          const keyword = filtesObj[
            filterKey as keyof typeof filtesObj
          ] as string;
          return (ele[filterKey as keyof T] as string)
            .toLowerCase()
            .includes(keyword.toLowerCase());
        });
      }
    });

    return result;
  }, [data, filter]);

  return (
    <>
      {filteredRecords.map((record) => (
        <TableRow
          key={`row-${record.id}`}
          isSelected={record.id === selectedRecord?.id}
          onClick={() => handleSelectRecord && handleSelectRecord(record)}
        >
          {haveCheckboxes && (
            <TableCell>
              <Checkbox
                id={`row-checkbox-${record.id}`}
                checked={!!selectedRows.find((ele) => ele.id === record.id)}
                onChange={(e) => handleCheckbox && handleCheckbox(e, record)}
              />
            </TableCell>
          )}
          {(handleEditRecord || handleDeleteRecord) && (
            <TableCell
              key={`col-action`}
              {...(stickyCols.includes(`action`) && {
                ["data-sticky-col"]: "action",
              })}
            >
              <div className="u-d-flex u-flex-ai-center">
                {handleEditRecord && (
                  <div className="u-m-r-8">
                    <Button
                      variant="icon"
                      modifiers={["inline"]}
                      onClick={() => handleEditRecord(record)}
                    >
                      <Icon iconName="edit" />
                    </Button>
                  </div>
                )}
                {handleDeleteRecord && (
                  <div className="u-m-r-8">
                    <Button
                      variant="icon"
                      modifiers={["inline"]}
                      onClick={() => handleDeleteRecord(record)}
                    >
                      <Icon iconName="delete" />
                    </Button>
                  </div>
                )}
              </div>
            </TableCell>
          )}
          {headerData.map((col, colIdx) => {
            if (!col.isShow) return;

            const keyVal = col.colKeyValue as string;
            const cellData = record[col.colKeyValue as keyof typeof record];

            if (col.renderCell) {
              return (
                <TableCell
                  key={`col-${keyVal}`}
                  {...(stickyCols.includes(keyVal) && {
                    ["data-sticky-col"]: colIdx,
                  })}
                >
                  {col.renderCell(record)}
                </TableCell>
              );
            }

            if (typeof cellData === "number") {
              return (
                <TableCell
                  key={`col-${keyVal}`}
                  textAlign="right"
                  {...(stickyCols.includes(keyVal) && {
                    ["data-sticky-col"]: colIdx,
                  })}
                >
                  <Text type="span">{commafy(cellData)}</Text>
                </TableCell>
              );
            }

            if (typeof cellData === "object") {
              return (
                <TableCell
                  key={`col-${keyVal}`}
                  textAlign="right"
                  {...(stickyCols.includes(keyVal) && {
                    ["data-sticky-col"]: colIdx,
                  })}
                >
                  <Text type="span">{JSON.stringify(cellData)}</Text>
                </TableCell>
              );
            }

            if (typeof cellData === "string") {
              return (
                <TableCell
                  key={`col-${keyVal}`}
                  {...(stickyCols.includes(keyVal) && {
                    ["data-sticky-col"]: colIdx,
                  })}
                >
                  <Text type="span">{cellData}</Text>
                </TableCell>
              );
            }

            return null;
          })}
        </TableRow>
      ))}
    </>
  );
};

interface TableColumnSettingProps {
  keyVal: string;
  colIdx: number;
  isStickyCol: boolean;
  handleStickyCol: ({
    keyVal,
    colIdx,
  }: {
    keyVal: string;
    colIdx: number;
  }) => void;
}

const TableColumnSetting: React.FC<TableColumnSettingProps> = ({
  colIdx,
  keyVal,
  isStickyCol,
  handleStickyCol,
}) => {
  //* Hooks
  const { t } = useTranslation();

  //* Refs
  const settingRef = useRef<PopperRef>(null);

  //* Hook-form
  const filterMethods = useFormContext();

  const handleTriggerSort = (type: "asc" | "desc") => {
    const sortVal = filterMethods.getValues("sort");
    if (sortVal?.keyVal === keyVal && sortVal.type === type) {
      filterMethods.setValue("sort", null);
      return;
    }

    filterMethods.setValue("sort", {
      keyVal: keyVal,
      type: type,
    });
  };

  return (
    <Popper
      ref={settingRef}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      toggleEl={
        <Button variant="icon" modifiers={["inline"]}>
          <Icon iconName="tableOption" size="16" />
        </Button>
      }
      customContentClass="u-m-t-8"
    >
      <Button
        variant="transparent"
        onClick={() => {
          handleStickyCol({
            keyVal,
            colIdx,
          });
          settingRef.current?.handleClose();
        }}
      >
        {t(`action.${isStickyCol ? "unpin" : "pin"}`)}
      </Button>
      <Button variant="transparent" onClick={() => handleTriggerSort("asc")}>
        {t(`action.sort`) + `: ` + t(`action.ascOrder`)}
      </Button>
      <Button variant="transparent" onClick={() => handleTriggerSort("desc")}>
        {t(`action.sort`) + `: ` + t(`action.descOrder`)}
      </Button>
    </Popper>
  );
};
