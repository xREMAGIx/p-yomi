import Button from "@client/components/atoms/Button";
import Link from "@client/components/atoms/Link";
import Text from "@client/components/atoms/Text";
import Pagination from "@client/components/molecules/Pagination";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import { DATE_TIME_FORMAT, DEFAULT_PAGINATION } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { warehouseQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";

export const Route = createLazyFileRoute("/_authenticated/warehouse/")({
  component: WarehouseList,
});

const headerData = [
  {
    id: "name",
    keyValue: "name",
    title: "Name",
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

function WarehouseList() {
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
    queryKey: [...warehouseQueryKeys.list({ page: pagination.page })],
    queryFn: async () => {
      const { data, error } = await server.api.v1.warehouse.index.get({
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
    <div className="p-warehouseList">
      <Button
        modifiers={["inline"]}
        onClick={() => navigate({ to: "/warehouse/create" })}
      >
        Create
      </Button>

      <div className="p-warehouseList_table u-m-t-32">
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
          {data?.map((ele) => (
            <TableRow key={`row-${ele.id}`}>
              {headerData.map((col) => {
                const keyVal = col.keyValue as keyof typeof ele;
                const data = ele[keyVal];
                if (
                  keyVal === "createdAt" ||
                  keyVal === "updatedAt" ||
                  data instanceof Date
                ) {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Text type="span">
                        {dayjs(data).format(DATE_TIME_FORMAT.DATE_TIME)}
                      </Text>
                    </TableCell>
                  );
                }

                if (keyVal === "name") {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Link
                        to="/warehouse/$id"
                        params={{ id: ele.id.toString() }}
                      >
                        {data}
                      </Link>
                    </TableCell>
                  );
                }

                return (
                  <TableCell key={`${ele.id}-${col.keyValue}`}>
                    <Text type="span">{data}</Text>
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
