import Button from "@client/components/atoms/Button";
import Icon from "@client/components/atoms/Icon";
import Link from "@client/components/atoms/Link";
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
} from "@client/containers/common/DeleteModal";
import { DATE_TIME_FORMAT, DEFAULT_PAGINATION } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { customerQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useRef, useState } from "react";

export const Route = createLazyFileRoute("/_authenticated/customer/")({
  component: CustomerList,
});

const headerData = [
  {
    id: "name",
    keyValue: "name",
    title: "Name",
  },
  {
    id: "phone",
    keyValue: "phone",
    title: "Phone",
  },
  {
    id: "email",
    keyValue: "email",
    title: "Email",
  },
  {
    id: "dateOfBirth",
    keyValue: "dateOfBirth",
    title: "Date of birth",
  },
  {
    id: "address",
    keyValue: "address",
    title: "Address",
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
  {
    id: "action",
    keyValue: "action",
    title: "Action",
  },
] as const;

function CustomerList() {
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
    queryKey: customerQueryKeys.list({ page: pagination.page }),
    queryFn: async () => {
      const { data, error } = await server.api.v1.customer.index.get({
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
    mutationKey: customerQueryKeys.delete(),
    mutationFn: async (params: { id: number }) => {
      const { error } = await server.api.v1
        .customer({ id: params.id })
        .delete();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      queryClient.invalidateQueries({ queryKey: customerQueryKeys.lists() });

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
    <div className="p-customerList">
      <Button
        modifiers={["inline"]}
        onClick={() => navigate({ to: "/customer/create" })}
      >
        Create
      </Button>

      <div className="p-customerList_table u-m-t-32">
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
                const keyVal = col.keyValue;

                if (keyVal === "dateOfBirth") {
                  return (
                    <TableCell key={`${ele.id}-${keyVal}`}>
                      <Text type="span">
                        {ele[keyVal]
                          ? dayjs(ele[keyVal]).format(DATE_TIME_FORMAT.DATE)
                          : null}
                      </Text>
                    </TableCell>
                  );
                }

                if (keyVal === "createdAt" || keyVal === "updatedAt") {
                  return (
                    <TableCell key={`${ele.id}-${keyVal}`}>
                      <Text type="span">
                        {dayjs(ele[keyVal]).format(DATE_TIME_FORMAT.DATE_TIME)}
                      </Text>
                    </TableCell>
                  );
                }

                if (keyVal === "name") {
                  return (
                    <TableCell key={`${ele.id}-${keyVal}`}>
                      <Link
                        to="/customer/$id"
                        params={{ id: ele.id.toString() }}
                      >
                        {ele[keyVal]}
                      </Link>
                    </TableCell>
                  );
                }

                if (keyVal === "action") {
                  return (
                    <TableCell key={`${ele.id}-${keyVal}`}>
                      <Button
                        variant="icon"
                        modifiers={["inline"]}
                        onClick={() => handleOpenAskDelete({ id: ele.id })}
                      >
                        <Icon iconName="delete" />
                      </Button>
                    </TableCell>
                  );
                }

                return (
                  <TableCell key={`${ele.id}-${keyVal}`}>
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
      <div className="p-customerList_deleteModal">
        <DeleteModal
          ref={deleteModalRef}
          isLoading={isPending}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}
