import Button from "@client/components/atoms/Button";
import Text from "@client/components/atoms/Text";
import Pagination from "@client/components/molecules/Pagination";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import { DATE_TIME_FORMAT, DEFAULT_PAGINATION } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { goodsReceiptQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";

export const Route = createLazyFileRoute("/_authenticated/goods-receipt/")({
  component: GoodsReceiptList,
});

const headerData = [
  {
    id: "warehouse",
    keyValue: "warehouse",
    title: "Warehouse",
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
];

function GoodsReceiptList() {
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
    queryKey: [...goodsReceiptQueryKeys.list({ page: pagination.page })],
    queryFn: async () => {
      const { data, error } = await server.api.v1["goods-receipt"].index.get({
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

  //* Functions
  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page: page }));
  };

  return (
    <div className="p-goodsReceiptList">
      <Button
        modifiers={["inline"]}
        onClick={() => navigate({ to: "/goods-receipt/create" })}
      >
        Create
      </Button>

      <div className="p-goodsReceiptList_table u-m-t-32">
        <Table
          header={
            <TableHeader>
              <TableRow isHead>
                {headerData.map((ele) => (
                  <TableCell key={ele.id} isHead>
                    <span>{ele.title}</span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
          }
        >
          {data?.map((ele) => (
            <TableRow key={`row-${ele.id}`}>
              {headerData.map((col) => {
                const keyVal = col.keyValue as keyof typeof ele;
                const element = ele[keyVal];
                if (keyVal === "warehouse") {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Text type="span">{ele[keyVal]?.name}</Text>
                    </TableCell>
                  );
                }

                if (
                  keyVal === "createdAt" ||
                  keyVal === "updatedAt" ||
                  element instanceof Date
                ) {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Text type="span">
                        {dayjs(ele[keyVal]).format(DATE_TIME_FORMAT.DATE_TIME)}
                      </Text>
                    </TableCell>
                  );
                }

                return (
                  <TableCell key={`${ele.id}-${col.keyValue}`}>
                    <Text type="span">{ele[keyVal]}</Text>
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
