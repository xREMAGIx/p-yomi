import Button from "@client/components/atoms/Button";
import Checkbox from "@client/components/atoms/Checkbox";
import Icon from "@client/components/atoms/Icon";
import Input from "@client/components/atoms/Input";
import Tag from "@client/components/atoms/Tag";
import Text from "@client/components/atoms/Text";
import Pagination from "@client/components/molecules/Pagination";
import Popper, { PopperRef } from "@client/components/molecules/Popper";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
  TableTextAlign,
} from "@client/components/organisms/Table";
import { DATE_TIME_FORMAT, DEFAULT_PAGINATION } from "@client/libs/constants";
import { handleConvertProductStatusTag } from "@client/libs/converter";
import { handleCheckAuthError } from "@client/libs/error";
import { commafy } from "@client/libs/functions";
import { productQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useTranslation } from "@client/libs/translation";
import { ProductData } from "@server/models/product.model";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
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
import { ProductFilter, SortForm } from "./ProductFilter";

const headerData = [
  {
    id: "action",
    keyValue: "action",
    title: "Action",
  },
  {
    id: "name",
    keyValue: "name",
    title: "Name",
  },
  {
    id: "description",
    keyValue: "description",
    title: "Description",
  },
  {
    id: "barcode",
    keyValue: "barcode",
    title: "Barcode",
  },
  {
    id: "price",
    keyValue: "price",
    title: "Price",
    textAlign: "right",
  },
  {
    id: "status",
    keyValue: "status",
    title: "Status",
  },
  {
    id: "createdAt",
    keyValue: "createdAt",
    title: "Created at",
  },
  {
    id: "updatedAt",
    keyValue: "updatedAt",
    title: "Updated at",
  },
] as const;

interface FilterForm {
  name: string;
  description: string;
  barcode: string;
  price: string;
  sort: {
    keyVal: string;
    type: "asc" | "desc";
  } | null;
}

type TableCell = {
  id: string;
  keyValue: string;
  title: string;
  textAlign?: TableTextAlign;
  isShow?: boolean;
};

type ColumnType = {
  id: string;
  keyValue: string;
  title: string;
  isShow: boolean;
};

interface ProductTableProps {
  handleDelete?: ({ id }: { id: number }) => void;
}

export interface ProductTableRef {}

export const ProductTable = forwardRef<ProductTableRef, ProductTableProps>(
  ({ handleDelete }, ref) => {
    //* Hooks
    const { t } = useTranslation();
    const navigate = useNavigate();

    //* States
    const [pagination, setPagination] = useState({
      limit: DEFAULT_PAGINATION.LIMIT,
      page: DEFAULT_PAGINATION.PAGE,
      total: 0,
      totalPages: 1,
    });
    const [searchText, setSearchText] = useState("");
    const [columns, setColumns] = useState(
      headerData.map((ele) => ({
        ...ele,
        id: ele.id as string,
        keyValue: ele.keyValue as string,
        title: ele.title as string,
        isShow: true,
      }))
    );
    const [sortParams, setSortParams] = useState<SortForm>({
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [stickyCols, setStickyCols] = useState<string[]>([]);

    //* Refs
    const tableRef = useRef<HTMLDivElement | null>(null);

    //* Hook-form
    const filterMethods = useForm<FilterForm>({
      defaultValues: {
        name: "",
        description: "",
        barcode: "",
        price: "",
      },
    });

    //* Query
    const { data, isFetching: isLoadingList } = useQuery({
      queryKey: productQueryKeys.list({
        page: pagination.page,
        search: searchText,
        sortBy: sortParams.sortBy,
        sortOrder: sortParams.sortOrder,
      }),
      queryFn: async () => {
        const { data, error } = await server.api.v1.product.index.get({
          query: {
            sortBy: sortParams.sortBy,
            sortOrder: sortParams.sortOrder,
            limit: pagination.limit,
            page: pagination.page,
            name: searchText,
            barcode: searchText,
          },
        });

        if (error) {
          handleCheckAuthError(error, navigate);
          throw error.value;
        }

        setPagination({
          ...data.meta,
        });

        return data.data;
      },
    });

    //* Mutations

    //* Memos

    //* Functions
    const handleChangePage = (page: number) => {
      setPagination((prev) => ({ ...prev, page: page }));
    };

    const handleSearch = (searchText: string) => {
      setSearchText(searchText);
    };

    const handleSort = (form: SortForm) => {
      setSortParams(form);
    };

    const handleCheckbox = (
      e: React.ChangeEvent<HTMLInputElement>,
      id: number
    ) => {
      if (e.target.checked) {
        setSelectedRows((prev) => [...prev, id]);
        return;
      }
      setSelectedRows((prev) => prev.filter((ele) => ele !== id));
    };

    const handleCheckboxAll = () => {
      if (!data) return;
      if (selectedRows.length !== data.length) {
        setSelectedRows(data.map((ele) => ele.id));
        return;
      }
      setSelectedRows([]);
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
      <div className="c-product_productTable">
        <div className="c-product_productTable_filter">
          <ProductFilter
            columns={columns}
            sortKeys={["name", "price", "createdAt", "updatedAt"]}
            handleSearch={handleSearch}
            handleChangeShowCol={setColumns}
            handleSort={handleSort}
          />
        </div>
        <div className="c-product_productTable_table u-m-t-32" ref={tableRef}>
          <FormProvider {...filterMethods}>
            <Table
              isLoading={isLoadingList}
              header={
                <TableHeader>
                  <TableRow isHead>
                    <TableCell isHead>
                      <Checkbox
                        id="check-all"
                        checked={selectedRows.length === data?.length}
                        onChange={handleCheckboxAll}
                      />
                    </TableCell>
                    {columns.map((ele: TableCell, colIdx) => {
                      if (!ele.isShow) return;
                      const isStickyCol = stickyCols.includes(ele.keyValue);

                      if (ele.keyValue === "action") {
                        return (
                          <TableCell
                            key={ele.id}
                            isHead
                            {...(ele.textAlign && { textAlign: ele.textAlign })}
                            {...(isStickyCol && {
                              ["data-sticky-type"]: "header",
                              ["data-sticky-col"]: colIdx,
                            })}
                          >
                            <span>{t(`table.${ele.keyValue}`)}</span>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={ele.id}
                          isHead
                          {...(ele.textAlign && { textAlign: ele.textAlign })}
                          {...(isStickyCol && {
                            ["data-sticky-type"]: "header",
                            ["data-sticky-col"]: colIdx,
                          })}
                        >
                          <div className="u-d-flex u-flex-ai-center u-flex-jc-between">
                            <span>{t(`table.${ele.keyValue}`)}</span>
                            <TableColumnSetting
                              keyVal={ele.keyValue}
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
                                  field.value.keyVal !== ele.keyValue
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
                  <TableRow>
                    <TableCell key={`header-filter-checkbox`}></TableCell>
                    {headerData.map((ele, colIdx) => {
                      const isStickyCol = stickyCols.includes(ele.keyValue);

                      switch (ele.keyValue) {
                        case "createdAt":
                        case "updatedAt":
                        case "action":
                        case "status":
                          return (
                            <TableCell
                              key={`header-filter-${ele.keyValue}`}
                              {...(isStickyCol && {
                                ["data-sticky-col"]: colIdx,
                              })}
                            ></TableCell>
                          );
                        default:
                          return (
                            <TableCell
                              key={ele.id}
                              modifiers={["noPadding"]}
                              {...(isStickyCol && {
                                ["data-sticky-col"]: colIdx,
                              })}
                            >
                              <Controller
                                control={filterMethods.control}
                                name={ele.keyValue}
                                defaultValue={""}
                                render={({ field, fieldState: { error } }) => (
                                  <Input
                                    id={`goods-receipt-product-filter-${ele.keyValue}`}
                                    {...field}
                                    error={error?.message}
                                  />
                                )}
                              />
                            </TableCell>
                          );
                      }
                    })}
                  </TableRow>
                </TableHeader>
              }
            >
              <TableContent
                selectedRows={selectedRows}
                stickyCols={stickyCols}
                columns={columns}
                products={data ?? []}
                handleSelectProduct={() => {}}
                handleCheckbox={handleCheckbox}
                handleDelete={handleDelete}
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
);

interface TableContentProps {
  selectedRows: number[];
  stickyCols: string[];
  columns: ColumnType[];
  products: ProductData[];
  selectedProduct?: ProductData;
  handleSelectProduct: (product: ProductData) => void;
  handleDelete?: ({ id }: { id: number }) => void;
  handleCheckbox?: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
}

const TableContent: React.FC<TableContentProps> = ({
  selectedRows,
  stickyCols,
  columns,
  products,
  selectedProduct,
  handleSelectProduct,
  handleDelete,
  handleCheckbox,
}) => {
  //* Hooks
  const navigate = useNavigate();

  //* Hook-form
  const filterMethods = useFormContext<FilterForm>();
  const filter = useWatch({ control: filterMethods.control });

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const { name, description, barcode, price, sort } = filter;

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

    if (name) {
      result = result.filter((ele) =>
        ele.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (description) {
      result = result.filter((ele) =>
        ele.description?.toLowerCase().includes(description.toLowerCase())
      );
    }

    if (barcode) {
      result = result.filter((ele) =>
        ele.barcode?.toLowerCase().includes(barcode.toLowerCase())
      );
    }

    if (price) {
      result = result.filter((ele) =>
        ele.price.toString().includes(price.toString())
      );
    }

    return result;
  }, [products, filter]);

  return (
    <>
      {filteredProducts.map((product) => (
        <TableRow
          key={`row-${product.id}`}
          isSelected={product.id === selectedProduct?.id}
          onClick={() => handleSelectProduct(product)}
        >
          <TableCell>
            <Checkbox
              id={`row-checkbox-${product.id}`}
              checked={selectedRows.includes(product.id)}
              onChange={(e) => handleCheckbox && handleCheckbox(e, product.id)}
            />
          </TableCell>
          {columns.map((col, colIdx) => {
            if (!col.isShow) return;

            const keyVal =
              col.keyValue as (typeof headerData)[number]["keyValue"];

            switch (keyVal) {
              case "createdAt":
              case "updatedAt": {
                return (
                  <TableCell
                    key={`col-${keyVal}`}
                    {...(stickyCols.includes(keyVal) && {
                      ["data-sticky-col"]: colIdx,
                    })}
                  >
                    <Text type="span">
                      {dayjs(product[keyVal]).format(
                        DATE_TIME_FORMAT.DATE_TIME
                      )}
                    </Text>
                  </TableCell>
                );
              }
              case "name": {
                return (
                  <TableCell
                    key={`col-${keyVal}`}
                    {...(stickyCols.includes(keyVal) && {
                      ["data-sticky-col"]: colIdx,
                    })}
                  >
                    <Link
                      to="/product/$id"
                      params={{ id: product.id.toString() }}
                    >
                      <Text type="span">{product[keyVal]}</Text>
                    </Link>
                  </TableCell>
                );
              }
              case "price": {
                return (
                  <TableCell
                    key={`col-${keyVal}`}
                    textAlign="right"
                    {...(stickyCols.includes(keyVal) && {
                      ["data-sticky-col"]: colIdx,
                    })}
                  >
                    <Text type="span">{commafy(product[keyVal])}</Text>
                  </TableCell>
                );
              }
              case "status": {
                const tagData = handleConvertProductStatusTag(product[keyVal]);

                return (
                  <TableCell
                    key={`col-${keyVal}`}
                    textAlign="right"
                    {...(stickyCols.includes(keyVal) && {
                      ["data-sticky-col"]: colIdx,
                    })}
                  >
                    <Tag modifiers={[tagData.color]} label={tagData.label} />
                  </TableCell>
                );
              }
              case "action": {
                return (
                  <TableCell
                    key={`col-${keyVal}`}
                    {...(stickyCols.includes(keyVal) && {
                      ["data-sticky-col"]: colIdx,
                    })}
                  >
                    <div className="u-d-flex u-flex-ai-center">
                      <div className="u-m-r-8">
                        <Button
                          variant="icon"
                          modifiers={["inline"]}
                          onClick={() =>
                            navigate({
                              to: "/product/$id",
                              params: { id: product.id.toString() },
                            })
                          }
                        >
                          <Icon iconName="edit" />
                        </Button>
                      </div>
                      <Button
                        variant="icon"
                        modifiers={["inline"]}
                        onClick={() =>
                          handleDelete && handleDelete({ id: product.id })
                        }
                      >
                        <Icon iconName="delete" />
                      </Button>
                    </div>
                  </TableCell>
                );
              }
              default: {
                return (
                  <TableCell
                    key={`col-${keyVal}`}
                    {...(stickyCols.includes(keyVal) && {
                      ["data-sticky-col"]: colIdx,
                    })}
                  >
                    <Text type="span">{product[keyVal]}</Text>
                  </TableCell>
                );
              }
            }
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
  const filterMethods = useFormContext<FilterForm>();

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
