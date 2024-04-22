import Button from "@client/components/atoms/Button";
import Text from "@client/components/atoms/Text";
import AdvanceTable from "@client/components/templates/AdvanceTable";
import {
  AdvanceTableColumnType,
  SortForm,
} from "@client/components/templates/AdvanceTable/types";
import {
  DeleteModal,
  DeleteModalRef,
} from "@client/containers/common/DeleteModal";
import { DATE_TIME_FORMAT, DEFAULT_PAGINATION } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { warehouseQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useTranslation } from "@client/libs/translation";
import { GetElementType } from "@client/libs/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";

export const Route = createLazyFileRoute("/_authenticated/warehouse/")({
  component: WarehouseList,
});

function WarehouseList() {
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
  const [sortParams, setSortParams] = useState<SortForm>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  //* Refs
  const deleteModalRef = useRef<DeleteModalRef>(null);

  //* Query
  const {
    data,
    isFetching: isLoadingList,
    refetch: listRefetch,
  } = useQuery({
    queryKey: warehouseQueryKeys.list({
      page: pagination.page,
      search: searchText,
      sortBy: sortParams.sortBy,
      sortOrder: sortParams.sortOrder,
    }),
    queryFn: async () => {
      const { data, error } = await server.api.v1.warehouse.index.get({
        query: {
          limit: pagination.limit,
          page: pagination.page,
          search: searchText,
          sortBy: sortParams.sortBy,
          sortOrder: sortParams.sortOrder,
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
  const { mutate: deleteMutate, isPending: isDeleteLoading } = useMutation({
    mutationKey: warehouseQueryKeys.delete(),
    mutationFn: async (params: { id: number }) => {
      const { error } = await server.api.v1.product({ id: params.id }).delete();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      listRefetch();

      deleteModalRef.current?.handleClose();
    },
  });

  //* Memos
  const headerData: AdvanceTableColumnType<
    GetElementType<NonNullable<typeof data>>
  >[] = useMemo(() => {
    return [
      {
        colId: "name",
        colKeyValue: "name",
      },
      {
        colId: "createdAt",
        colKeyValue: "createdAt",
        renderCell: (cellData) => (
          <Text type="span">
            {dayjs(cellData["createdAt"]).format(DATE_TIME_FORMAT.DATE_TIME)}
          </Text>
        ),
      },

      {
        colId: "updatedAt",
        colKeyValue: "updatedAt",
        renderCell: (cellData) => (
          <Text type="span">
            {dayjs(cellData["updatedAt"]).format(DATE_TIME_FORMAT.DATE_TIME)}
          </Text>
        ),
      },
    ];
  }, []);

  //* Functions
  const handleDelete = (props: { id: number }) => {
    deleteMutate({ id: props.id });
  };

  const handleOpenAskDelete = (
    record: GetElementType<NonNullable<typeof data>>
  ) => {
    deleteModalRef.current?.handleOpen({ id: record.id });
  };

  const handleEditRecord = (
    record: GetElementType<NonNullable<typeof data>>
  ) => {
    navigate({ to: "/warehouse/$id", params: { id: record.id.toString() } });
  };

  return (
    <div className="p-warehouseList">
      <Button
        modifiers={["inline"]}
        onClick={() => navigate({ to: "/warehouse/create" })}
      >
        {t("action.create")}
      </Button>

      <div className="p-warehouseList_table u-m-t-32">
        <AdvanceTable
          isLoading={isLoadingList}
          headerData={headerData}
          data={data ?? []}
          sortKeys={["name", "createdAt", "updatedAt"]}
          inlineSearchKeys={["name"]}
          handleSearchText={setSearchText}
          handleSortParams={setSortParams}
          handleEditRecord={handleEditRecord}
          handleDeleteRecord={handleOpenAskDelete}
        />
      </div>

      <div className="p-warehouseList_deleteModal">
        <DeleteModal
          ref={deleteModalRef}
          isLoading={isDeleteLoading}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}
