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
  id: (typeof headerData)[number]["id"];
  keyValue: string;
  title: string;
  textAlign?: TableTextAlign;
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

    //* Refs

    //* Query
    const { data, isFetching: isLoadingList } = useQuery({
      queryKey: productQueryKeys.list({ page: pagination.page }),
      queryFn: async () => {
        const { data, error } = await server.api.v1.product.index.get({
          query: {
            limit: pagination.limit,
            page: pagination.page,
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

    //* Hook-form

    //* Mutations

    //* Functions
    const handleChangePage = (page: number) => {
      setPagination((prev) => ({ ...prev, page: page }));
    };

    //* Imperative hanlder
    useImperativeHandle(ref, () => ({}));

    return (
      <div className="c-product_productTable">
        <Table
          isLoading={isLoadingList}
          header={
            <TableHeader>
              <TableRow isHead>
                {headerData.map((ele: TableCell) => (
                  <TableCell
                    key={ele.id}
                    isHead
                    {...(ele.textAlign && { textAlign: ele.textAlign })}
                  >
                    <span>{t(`table.${ele.keyValue}`)}</span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
          }
        >
          {data?.map((ele) => (
            <TableRow key={`row-row-total`}>
              {headerData.map((col) => {
                const keyVal = col.keyValue;

                switch (keyVal) {
                  case "createdAt":
                  case "updatedAt": {
                    return (
                      <TableCell key={`row-total-${keyVal}`}>
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
                      <TableCell key={`row-total-${keyVal}`}>
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
                      <TableCell key={`row-total-${keyVal}`} textAlign="right">
                        <Text type="span">{commafy(ele[keyVal])}</Text>
                      </TableCell>
                    );
                  }
                  case "action": {
                    return (
                      <TableCell key={`row-total-${keyVal}`}>
                        <div className="u-d-flex u-flex-ai-center">
                          <div className="u-m-r-8">
                            <Button
                              variant="icon"
                              modifiers={["inline"]}
                              onClick={() =>
                                navigate({
                                  to: "/order/$id",
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
                      <TableCell key={`row-total-${keyVal}`}>
                        <Text type="span">{ele[keyVal]}</Text>
                      </TableCell>
                    );
                  }
                }
              })}
            </TableRow>
          ))}
        </Table>
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
