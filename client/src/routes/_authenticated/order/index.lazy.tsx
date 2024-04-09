import Button from "@client/components/atoms/Button";
import Icon from "@client/components/atoms/Icon";
import Link from "@client/components/atoms/Link";
import Tag from "@client/components/atoms/Tag";
import Text from "@client/components/atoms/Text";
import Pagination from "@client/components/molecules/Pagination";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import {
  DeleteModal,
  DeleteModalRef,
} from "@client/components/pages/common/DeleteModal";
import { DATE_TIME_FORMAT, DEFAULT_PAGINATION } from "@client/libs/constants";
import { handleConvertOrderStatusTag } from "@client/libs/converter";
import { handleCheckAuthError } from "@client/libs/error";
import { orderQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useRef, useState } from "react";

export const Route = createLazyFileRoute("/_authenticated/order/")({
  component: OrderList,
});

const headerData = [
  {
    id: "action",
    keyValue: "action",
    title: "Action",
  },
  {
    id: "code",
    keyValue: "code",
    title: "Code",
  },
  {
    id: "customerName",
    keyValue: "customerName",
    title: "Customer name",
  },
  {
    id: "customerPhone",
    keyValue: "customerPhone",
    title: "Customer phone",
  },
  {
    id: "total",
    keyValue: "total",
    title: "Total",
  },
  {
    id: "paid",
    keyValue: "paid",
    title: "Paid",
  },
  {
    id: "due",
    keyValue: "due",
    title: "Due",
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
];

function OrderList() {
  //* Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //* States
  const [pagination, setPagination] = useState({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });

  //* Refs
  const deleteModalRef = useRef<DeleteModalRef>(null);

  //* Query
  const { data, isFetching: isLoadingList } = useQuery({
    queryKey: orderQueryKeys.list({ page: pagination.page }),
    queryFn: async () => {
      const { data, error } = await server.api.v1.order.index.get({
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

  //* Mutation
  const { mutate: deleteMutate, isPending } = useMutation({
    mutationKey: orderQueryKeys.delete(),
    mutationFn: async (params: { id: number }) => {
      const { error } = await server.api.v1.order({ id: params.id }).delete();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });

      deleteModalRef.current?.handleClose();
    },
  });

  //* Functions
  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page: page }));
  };

  const handleDelete = (props: { id: number }) => {
    deleteMutate({ id: props.id });
  };

  const handleOpenAskDelete = (props: { id: number }) => {
    deleteModalRef.current?.handleOpen(props);
  };

  return (
    <div className="p-orderList">
      <Button
        modifiers={["inline"]}
        onClick={() => navigate({ to: "/order/create" })}
      >
        Create
      </Button>

      <div className="p-orderList_table u-m-t-32">
        <Table
          isLoading={isLoadingList}
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

                if (keyVal === "code") {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Link to="/order/$id" params={{ id: ele.id.toString() }}>
                        {data}
                      </Link>
                    </TableCell>
                  );
                }

                if (keyVal === "status") {
                  const tagData = handleConvertOrderStatusTag(ele.status);
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Tag modifiers={[tagData.color]} label={tagData.label} />
                    </TableCell>
                  );
                }

                if (col.keyValue === "action") {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
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
                          onClick={() => handleOpenAskDelete({ id: ele.id })}
                        >
                          <Icon iconName="delete" />
                        </Button>
                      </div>
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
      <div className="p-orderList_deleteModal">
        <DeleteModal
          ref={deleteModalRef}
          isLoading={isPending}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}
