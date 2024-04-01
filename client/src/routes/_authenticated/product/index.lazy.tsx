import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Icon from "@client/components/atoms/Icon";
import Link from "@client/components/atoms/Link";
import Text from "@client/components/atoms/Text";
import Pagination from "@client/components/molecules/Pagination";
import Modal from "@client/components/organisms/Modal";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import { DATE_TIME_FORMAT, DEFAULT_PAGINATION } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { productQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
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
];

function ProductList() {
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
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: -1,
  });

  //* Query
  const { data } = useQuery({
    queryKey: [...productQueryKeys.list({ page: pagination.page })],
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

  //* Mutation
  const { mutate: deleteMutate, isPending } = useMutation({
    mutationKey: [...productQueryKeys.delete(deleteModal.id)],
    mutationFn: async () => {
      const { error } = await server.api.v1
        .product({ id: deleteModal.id })
        .delete();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });

      if (deleteModal.isOpen) handleCloseAskDelete();
    },
  });

  //* Functions
  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page: page }));
  };

  const handleOpenAskDelete = (id: number) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleCloseAskDelete = () => {
    setDeleteModal({ isOpen: false, id: -1 });
  };

  const handleDelete = () => {
    deleteMutate();
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
                        to="/product/$id"
                        params={{ id: ele.id.toString() }}
                      >
                        {data}
                      </Link>
                    </TableCell>
                  );
                }

                if (col.keyValue === "action") {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Button
                        variant="icon"
                        modifiers={["inline"]}
                        onClick={() => handleOpenAskDelete(ele.id)}
                      >
                        <Icon iconName="delete" />
                      </Button>
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
      <div className="p-productList_deleteModal">
        <Modal
          isOpen={deleteModal.isOpen}
          handleClose={handleCloseAskDelete}
          headerComponent={
            <Heading type="h6" modifiers={["20x30"]}>
              Delete
            </Heading>
          }
        >
          <Text>Are you sure you want to delete this record?</Text>
          <div className="u-d-flex u-flex-jc-end u-flex-ai-center">
            <Button
              variant="outlinePrimary"
              modifiers={["inline"]}
              onClick={handleCloseAskDelete}
            >
              Cancel
            </Button>
            <div className="u-m-l-8">
              <Button
                isLoading={isPending}
                modifiers={["inline"]}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
