import Button from "@client/components/atoms/Button";
import {
  DeleteModal,
  DeleteModalRef,
} from "@client/containers/common/DeleteModal";
import { ProductTable } from "@client/containers/product/ProductTable";
import { handleCheckAuthError } from "@client/libs/error";
import { productQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useTranslation } from "@client/libs/translation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createLazyFileRoute("/_authenticated/product/")({
  component: ProductList,
});

function ProductList() {
  //* Hooks
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //* States

  //* Refs
  const deleteModalRef = useRef<DeleteModalRef>(null);

  //* Mutation
  const { mutate: deleteMutate, isPending } = useMutation({
    mutationKey: productQueryKeys.delete(),
    mutationFn: async (params: { id: number }) => {
      const { error } = await server.api.v1.product({ id: params.id }).delete();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });

      deleteModalRef.current?.handleClose();
    },
  });

  //* Functions
  const handleDelete = (props: { id: number }) => {
    deleteMutate({ id: props.id });
  };

  const handleOpenAskDelete = (props: { id: number }) => {
    deleteModalRef.current?.handleOpen(props);
  };

  return (
    <div className="p-productList">
      <Button
        modifiers={["inline"]}
        onClick={() => navigate({ to: "/product/create" })}
      >
        {t("action.create")}
      </Button>
      <div className="p-productList_table u-m-t-32">
        <ProductTable handleDelete={handleOpenAskDelete} />
      </div>
      <div className="p-productList_deleteModal">
        <DeleteModal
          ref={deleteModalRef}
          isLoading={isPending}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}
