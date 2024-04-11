import Button from "@client/components/atoms/Button";
import Icon from "@client/components/atoms/Icon";
import Text from "@client/components/atoms/Text";
import Pagination from "@client/components/molecules/Pagination";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
  TableTextAlign,
} from "@client/components/organisms/Table";
import { DATE_TIME_FORMAT, DEFAULT_PAGINATION } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { commafy } from "@client/libs/functions";
import { productQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useTranslation } from "@client/libs/translation";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { forwardRef, useImperativeHandle, useState } from "react";
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

type TableCell = {
  id: string;
  keyValue: string;
  title: string;
  textAlign?: TableTextAlign;
  isShow?: boolean;
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

    //* Refs

    //* Hook-form

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

    //* Imperative hanlder
    useImperativeHandle(ref, () => ({}));

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
        <div className="c-product_productTable_table u-m-t-32">
          <Table
            isLoading={isLoadingList}
            header={
              <TableHeader>
                <TableRow isHead>
                  {columns.map((ele: TableCell) => {
                    if (!ele.isShow) return;

                    return (
                      <TableCell
                        key={ele.id}
                        isHead
                        {...(ele.textAlign && { textAlign: ele.textAlign })}
                      >
                        <span>{t(`table.${ele.keyValue}`)}</span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHeader>
            }
          >
            {data?.map((ele) => (
              <TableRow key={`row-col-${ele.id}`}>
                {columns.map((col) => {
                  if (!col.isShow) return;

                  const keyVal =
                    col.keyValue as (typeof headerData)[number]["keyValue"];

                  switch (keyVal) {
                    case "createdAt":
                    case "updatedAt": {
                      return (
                        <TableCell key={`col-${keyVal}`}>
                          <Text type="span">
                            {dayjs(ele[keyVal]).format(
                              DATE_TIME_FORMAT.DATE_TIME
                            )}
                          </Text>
                        </TableCell>
                      );
                    }
                    case "name": {
                      return (
                        <TableCell key={`col-${keyVal}`}>
                          <Link
                            to="/product/$id"
                            params={{ id: ele.id.toString() }}
                          >
                            <Text type="span">{ele[keyVal]}</Text>
                          </Link>
                        </TableCell>
                      );
                    }
                    case "price": {
                      return (
                        <TableCell key={`col-${keyVal}`} textAlign="right">
                          <Text type="span">{commafy(ele[keyVal])}</Text>
                        </TableCell>
                      );
                    }
                    case "action": {
                      return (
                        <TableCell key={`col-${keyVal}`}>
                          <div className="u-d-flex u-flex-ai-center">
                            <div className="u-m-r-8">
                              <Button
                                variant="icon"
                                modifiers={["inline"]}
                                onClick={() =>
                                  navigate({
                                    to: "/product/$id",
                                    params: { id: ele.id.toString() },
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
                                handleDelete && handleDelete({ id: ele.id })
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
                        <TableCell key={`col-${keyVal}`}>
                          <Text type="span">{ele[keyVal]}</Text>
                        </TableCell>
                      );
                    }
                  }
                })}
              </TableRow>
            ))}
          </Table>
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
