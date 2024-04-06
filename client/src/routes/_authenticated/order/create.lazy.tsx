import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Input from "@client/components/atoms/Input";
import Select from "@client/components/molecules/Select";
import { ProductTable } from "@client/components/pages/order/ProductTable";
import { DEFAULT_PAGINATION, FORM_VALIDATION } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { warehouseQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { ProductData } from "@server/models/product.model";
import { useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export const Route = createLazyFileRoute("/_authenticated/order/create")({
  component: OrderCreate,
});

interface OrderForm {
  customerId: number | null;
  customerName: string;
  customerPhone: string;
  warehouse: {
    value: number;
    label: string;
  };
  products: (Omit<ProductData, "id"> & { productId: number })[];
}

function OrderCreate() {
  //* Hooks
  const router = useRouter();
  const navigate = useNavigate();

  //* Refs
  const warehousePagination = useRef({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });

  //* Hook-form
  const orderMethods = useForm<OrderForm>();
  const selectedWarehouseId = useWatch({
    control: orderMethods.control,
    name: "warehouse.value",
  });

  //* Query
  const { data: warehouseData } = useQuery({
    queryKey: warehouseQueryKeys.list({
      page: warehousePagination.current.page,
    }),
    queryFn: async () => {
      const { data, error } = await server.api.v1.warehouse.index.get({
        query: {
          limit: warehousePagination.current.limit,
          page: warehousePagination.current.page,
        },
      });

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      warehousePagination.current = {
        ...data.meta,
      };

      return data.data;
    },
  });

  return (
    <div className="p-orderCreate">
      <div className="u-d-flex u-flex-jc-between">
        <Button
          modifiers={["inline"]}
          variant="outlinePrimary"
          onClick={() => router.history.back()}
        >
          Back
        </Button>
        <Button modifiers={["inline"]}>Create</Button>
      </div>
      <div className="u-m-t-16">
        <Heading>Create Order</Heading>
      </div>
      <div className="u-m-t-32">
        <div className="u-d-flex u-flex-jc-between">
          <div className="p-orderCreate_customer u-flex-1 u-p-r-8">
            <Controller
              control={orderMethods.control}
              name="customerPhone"
              defaultValue={""}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="order-customerPhone"
                  label="Customer phone"
                  {...field}
                  error={error?.message}
                />
              )}
            />
            <div className="u-m-t-8">
              <Controller
                control={orderMethods.control}
                name="customerName"
                defaultValue={""}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    id="order-customerName"
                    label="Customer name"
                    {...field}
                    error={error?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className="p-orderCreate_warehouse u-flex-1 u-p-l-8">
            <Controller
              control={orderMethods.control}
              name="warehouse"
              rules={{
                required: FORM_VALIDATION.REQUIRED,
              }}
              render={({
                field: { value, onBlur, onChange },
                fieldState: { error },
              }) => (
                <Select
                  id="goods-receipt-warehouse"
                  label="Warehouse"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  options={warehouseData?.map((ele) => ({
                    value: ele.id,
                    label: ele.name,
                  }))}
                  error={error?.message}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="u-m-t-16">
        <ProductTable selectedWarehouseId={selectedWarehouseId} />
      </div>
    </div>
  );
}
