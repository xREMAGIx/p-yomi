import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Input from "@client/components/atoms/Input";
import Text from "@client/components/atoms/Text";
import Pagination from "@client/components/molecules/Pagination";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import {
  DATE_TIME_FORMAT,
  DEFAULT_PAGINATION,
  FORM_VALIDATION,
  TOAST_SUCCESS_MESSAGE,
} from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { inventoryQueryKeys, warehouseQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useTranslation } from "@client/libs/translation";
import { UpdateInventoryConfigParams } from "@server/models/inventory.model";
import { UpdateWarehouseParams } from "@server/models/warehouse.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/_authenticated/warehouse/$id")({
  component: WarehouseDetail,
});

const headerData = [
  {
    id: "name",
    keyValue: "productName",
    title: "Product Name",
  },
  {
    id: "barcode",
    keyValue: "productBarcode",
    title: "Barcode",
  },
  {
    id: "quantity",
    keyValue: "quantityAvailable",
    title: "Quantity",
  },
  {
    id: "minimumStockLevel",
    keyValue: "minimumStockLevel",
    title: "Minimum Stock Level",
  },
  {
    id: "maximumStockLevel",
    keyValue: "maximumStockLevel",
    title: "Maximum Stock Level",
  },
  {
    id: "reorderPoint",
    keyValue: "reorderPoint",
    title: "Reorder Point",
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

function WarehouseDetail() {
  //* Hooks
  const { t } = useTranslation();
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();

  //* States
  const [pagination, setPagination] = useState({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });

  //* Hook-form
  const methods = useForm<UpdateWarehouseParams>({
    defaultValues: {
      name: "",
    },
  });
  const inventoryMethods = useForm<UpdateInventoryConfigParams>();

  //* Query
  useQuery({
    queryKey: warehouseQueryKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await server.api.v1.warehouse({ id: id }).get();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      methods.reset({
        name: data.data.name,
      });
      return data.data;
    },
  });

  const { data: inventoryData, isFetching: isLoadingInventory } = useQuery({
    queryKey: warehouseQueryKeys.inventory(id),
    queryFn: async () => {
      const { data, error } = await server.api.v1.inventory
        .warehouse({ id })
        .get();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      setPagination({
        ...data.meta,
      });

      inventoryMethods.reset({
        configs: data.data.map((ele) => ({
          id: ele.id,
          minimumStockLevel: ele.minimumStockLevel,
          maximumStockLevel: ele.maximumStockLevel,
          reorderPoint: ele.reorderPoint,
        })),
      });

      return data.data;
    },
  });

  //* Mutation
  const { mutate: updateMutate, isPending: isLoadingUpdate } = useMutation({
    mutationKey: warehouseQueryKeys.update(id),
    mutationFn: async (params: UpdateWarehouseParams) => {
      const { error } = await server.api.v1.warehouse({ id: id }).put(params);

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      toast.success(TOAST_SUCCESS_MESSAGE.UPDATE);
    },
  });

  const { mutate: updateConfigMutate, isPending: isLoadingConfigUpdate } =
    useMutation({
      mutationKey: inventoryQueryKeys.updateConfig(),
      mutationFn: async (params: UpdateInventoryConfigParams) => {
        const { error } = await server.api.v1.inventory.configs.put(params);

        if (error) {
          handleCheckAuthError(error, navigate);
          throw error.value;
        }

        toast.success(TOAST_SUCCESS_MESSAGE.UPDATE);
      },
    });

  //* Functions
  const onSubmit = (form: UpdateWarehouseParams) => {
    updateMutate({
      ...form,
    });
  };

  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page: page }));
  };

  const onSubmitConfig = (form: UpdateInventoryConfigParams) => {
    updateConfigMutate({
      ...form,
    });
  };

  return (
    <div className="p-warehouseDetail">
      <div className="u-d-flex u-flex-jc-between">
        <Button
          modifiers={["inline"]}
          variant="outlinePrimary"
          onClick={() => router.history.back()}
        >
          {t("action.back")}
        </Button>
        <Button
          modifiers={["inline"]}
          isLoading={isLoadingUpdate}
          onClick={methods.handleSubmit(onSubmit)}
        >
          Update info
        </Button>
      </div>
      <div className="p-warehouseDetail_form">
        <FormProvider {...methods}>
          <div className="u-m-t-16">
            <Heading>{t("action.warehouseDetail")}</Heading>
          </div>
          <div className="u-m-t-16">
            <Controller
              control={methods.control}
              name="name"
              rules={{
                required: FORM_VALIDATION.REQUIRED,
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="warehouse-create-name"
                  label="Name"
                  {...field}
                  error={error?.message}
                />
              )}
            />
          </div>
        </FormProvider>
      </div>

      <div className="u-m-t-32">
        <div className="u-d-flex u-flex-jc-between">
          <Heading modifiers={["20x30"]}>Inventory</Heading>
          <Button
            variant="secondary"
            modifiers={["inline"]}
            isLoading={isLoadingConfigUpdate}
            onClick={inventoryMethods.handleSubmit(onSubmitConfig)}
          >
            Update config
          </Button>
        </div>
      </div>
      <div className="p-warehouseDetail_inventory u-m-t-16">
        <Table
          isLoading={isLoadingInventory}
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
          {inventoryData?.map((ele, index) => (
            <TableRow key={`row-${ele.id}`}>
              {headerData.map((col) => {
                const keyVal = col.keyValue;

                if (keyVal === "createdAt" || keyVal === "updatedAt") {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Text type="span">
                        {dayjs(ele[keyVal]).format(DATE_TIME_FORMAT.DATE_TIME)}
                      </Text>
                    </TableCell>
                  );
                }

                if (keyVal === "productName") {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Text type="span">{ele.product?.name}</Text>
                    </TableCell>
                  );
                }

                if (keyVal === "productBarcode") {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Text type="span">{ele.product?.barcode}</Text>
                    </TableCell>
                  );
                }

                if (
                  col.keyValue === "minimumStockLevel" ||
                  col.keyValue === "maximumStockLevel" ||
                  col.keyValue === "reorderPoint"
                ) {
                  return (
                    <TableCell key={`${ele.id}-${col.keyValue}`}>
                      <Controller
                        control={inventoryMethods.control}
                        name={`configs.${index}.${col.keyValue}`}
                        defaultValue={0}
                        rules={{
                          required: FORM_VALIDATION.REQUIRED,
                        }}
                        render={({
                          field: { ref, value, onBlur, onChange },
                          fieldState: { error },
                        }) => (
                          <Input
                            id={`warehouse-input-${col.keyValue}`}
                            type="number"
                            ref={ref}
                            value={value}
                            onBlur={onBlur}
                            onChange={(e) =>
                              onChange(
                                e.target.value ? Number(e.target.value) : ""
                              )
                            }
                            error={error?.message}
                          />
                        )}
                      />
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
