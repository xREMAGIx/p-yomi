import Button from "@client/components/atoms/Button";
import Pagination from "@client/components/molecules/Pagination";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import {
  DATE_TIME_FORMAT,
  DEFAULT_PAGINATION,
  QUERY_KEYS,
} from "@client/libs/constants";
import { server } from "@client/libs/server";
import { useQuery } from "@tanstack/react-query";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";

export const Route = createLazyFileRoute("/_authenticated/product/")({
  component: ProductList,
});

const headerData = [
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
  },
];

function ProductList() {
  //* Hooks
  const navigate = useNavigate();

  //* States
  const [pagination, setPagination] = useState({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });

  //* Query
  const { data } = useQuery({
    queryKey: [...QUERY_KEYS.PRODUCT_LIST, pagination.page],
    queryFn: async () => {
      const { data } = await server.api.v1.product.index.get({
        query: {
          limit: pagination.limit,
          page: pagination.page,
        },
      });

      if (data) {
        setPagination({
          ...data.meta,
        });
        return data;
      }
    },
  });

  //* Functions
  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page: page }));
  };

  return (
    <div className="p-productList">
      <Button
        modifiers={["inline"]}
        onClick={() => navigate({ to: "/product/create" })}
      >
        Create
      </Button>

      <div className="p-productList_table u-m-t-32">
        <Table
          header={
            <TableHeader>
              <TableRow>
                {headerData.map((ele) => (
                  <TableCell key={ele.id} isHead>
                    <span>{ele.title}</span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
          }
        >
          {data?.data.map((ele) => (
            <TableRow key={`row-${ele.id}`}>
              {headerData.map((col) => {
                const keyVal = col.keyValue as keyof typeof ele;
                const data = ele[keyVal];
                if (data instanceof Date) {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <span>
                        {dayjs(data).format(DATE_TIME_FORMAT.DATE_TIME)}
                      </span>
                    </TableCell>
                  );
                }

                if (keyVal === "name") {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Link
                        to="/product/$id"
                        params={{ id: ele.id.toString() }}
                      >
                        {data}
                      </Link>
                    </TableCell>
                  );
                }

                return (
                  <TableCell key={`${ele.id}-${col.keyValue}`}>
                    <span>{data}</span>
                  </TableCell>
                );
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
    </div>
  );
}
