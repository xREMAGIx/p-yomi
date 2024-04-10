import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Input from "@client/components/atoms/Input";
import TextArea from "@client/components/atoms/TextArea";
import Select from "@client/components/molecules/Select";
import {
  CustomerModal,
  CustomerModalRef,
} from "@client/containers/order/CustomerModal";
import { ProductTable } from "@client/containers/order/ProductTable";
import {
  DEFAULT_PAGINATION,
  FORM_VALIDATION,
  TOAST_ERROR_MESSAGE,
  TOAST_SUCCESS_MESSAGE,
} from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { commafy } from "@client/libs/functions";
import { orderQueryKeys, warehouseQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import {
  CustomerData,
  GetListCustomerParams,
} from "@server/models/customer.model";
import {
  CreateOrderParams,
  OrderProductData,
} from "@server/models/order.model";
import { PaymentMethod, PaymentMethodCode } from "@server/models/payment.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/_authenticated/order/create")({
  component: OrderCreate,
});

interface OrderForm {
  warehouse: {
    value: number;
    label: string;
  } | null;
  products: (Omit<OrderProductData, "id"> & {
    productId: number;
    inventory: {
      warehouseId: number;
      quantityAvailable: number;
      warehouseName: string;
    }[];
  })[];
  total: number;
  paid: number;
  due: number;
  discount: number;
  note: string;
  paymentMethod: {
    value: number;
    label: string;
  };
}

interface CustomerForm {
  customerId: number | null;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

function OrderCreate() {
  //* Hooks
  const router = useRouter();
  const navigate = useNavigate();

  //* Refs
  const customerModalRef = useRef<CustomerModalRef>(null);
  const warehousePagination = useRef({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });

  //* Hook-form
  const customerMethods = useForm<CustomerForm>({
    defaultValues: {
      customerId: null,
      customerName: "",
      customerPhone: "",
      customerAddress: "",
    },
  });
  const orderMethods = useForm<OrderForm>({
    defaultValues: {
      warehouse: null,
      products: [],
    },
  });
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

  //* Mutation
  const { isPending: isLoadingCustomerSearch, mutate: customerSearchMutate } =
    useMutation({
      mutationKey: orderQueryKeys.searchCustomer(),
      mutationFn: async (params: GetListCustomerParams) => {
        const { data, error } = await server.api.v1.customer.index.get({
          query: {
            ...params,
          },
        });

        if (error) {
          handleCheckAuthError(error, navigate);
          throw error.value;
        }

        if (!data.data.length) {
          toast.error(TOAST_ERROR_MESSAGE.CUSTOMER_NOT_FOUND);
          return;
        }

        customerModalRef.current?.handleListCustomer(data.data);
        customerModalRef.current?.handleOpen();
      },
    });

  const { isPending: isLoadingCreateOrder, mutate: createOrderMutate } =
    useMutation({
      mutationKey: orderQueryKeys.create(),
      mutationFn: async (params: CreateOrderParams) => {
        const { error } = await server.api.v1.order.index.post(params);

        if (error) {
          handleCheckAuthError(error, navigate);
          throw error.value;
        }

        customerMethods.reset();
        orderMethods.reset();
        toast.success(TOAST_SUCCESS_MESSAGE.CREATE);
      },
    });

  //* Function
  const onSearchUser = (form: CustomerForm) => {
    if (!form.customerName && !form.customerPhone) return;

    customerSearchMutate({
      name: form.customerName,
      phone: form.customerPhone,
    });
  };

  const handleUpdateUser = (customer: CustomerData) => {
    customerMethods.reset({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address ?? "",
    });
  };

  const handleSubmit = async () => {
    const isValidCustomer = await customerMethods.trigger();

    if (!isValidCustomer) return;

    orderMethods.handleSubmit(handleCreate)();
  };

  const handleCreate = (form: OrderForm) => {
    const { paymentMethod, products, warehouse, ...rest } = form;
    const customer = customerMethods.getValues();

    if (!warehouse) {
      toast.error("Please select warehouse!");
      return;
    }

    createOrderMutate({
      ...rest,
      ...customer,
      products: products.map((ele) => ({
        productId: ele.productId,
        quantity: ele.quantity,
      })),
      warehouseId: warehouse.value,
      payment: {
        type: paymentMethod.value,
      },
    });
  };

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
        <Button
          modifiers={["inline"]}
          isLoading={isLoadingCreateOrder}
          onClick={handleSubmit}
        >
          Create
        </Button>
      </div>
      <div className="u-m-t-16">
        <Heading>Create Order</Heading>
      </div>
      <div className="u-m-t-32">
        <div className="u-d-flex u-flex-jc-between">
          <div className="p-orderCreate_customer u-flex-1 u-p-r-8">
            <form onSubmit={customerMethods.handleSubmit(onSearchUser)}>
              <Controller
                control={customerMethods.control}
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
                  control={customerMethods.control}
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
              <div className="u-m-t-8">
                <Controller
                  control={customerMethods.control}
                  name="customerAddress"
                  defaultValue={""}
                  render={({ field, fieldState: { error } }) => (
                    <TextArea
                      id="order-customerAddress"
                      label="Customer address"
                      rows={2}
                      {...field}
                      value={field.value ?? ""}
                      error={error?.message}
                    />
                  )}
                />
              </div>
              <div className="u-m-t-8 u-d-flex u-flex-jc-between u-flex-ai-end">
                <div className="u-flex-1 u-p-r-8">
                  <Controller
                    control={customerMethods.control}
                    name="customerId"
                    defaultValue={null}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        id="order-customerId"
                        label="Customer id"
                        {...field}
                        value={field.value ?? ""}
                        disabled
                        error={error?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Button
                    variant="secondary"
                    isLoading={isLoadingCustomerSearch}
                    type="submit"
                    modifiers={["inline"]}
                  >
                    Search User
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div className="p-orderCreate_warehouse u-flex-1 u-p-l-8">
            <Controller
              control={orderMethods.control}
              name="warehouse"
              defaultValue={null}
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
            <div className="u-m-t-8">
              <Controller
                control={orderMethods.control}
                defaultValue={""}
                name="note"
                render={({ field, fieldState: { error } }) => (
                  <TextArea
                    id="order-note"
                    label="Note"
                    rows={5}
                    {...field}
                    error={error?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <FormProvider {...orderMethods}>
        <div className="u-m-t-16">
          <ProductTable selectedWarehouseId={selectedWarehouseId} />
        </div>
        <div className="u-m-t-16 u-d-flex u-flex-jc-end">
          <TotalOrder />
        </div>
      </FormProvider>
      <div className="p-orderCreate_customerModal">
        <CustomerModal
          ref={customerModalRef}
          handleAddCustomer={handleUpdateUser}
        />
      </div>
    </div>
  );
}

const TotalOrder: React.FC = () => {
  //* Hook-form
  const methods = useFormContext<OrderForm>();
  const products = useWatch({
    control: methods.control,
    name: `products`,
  });
  const paid = useWatch({
    control: methods.control,
    name: "paid",
  });
  const discount = useWatch({
    control: methods.control,
    name: "discount",
  });

  //* Memos
  const sum = useMemo(() => {
    return (products ?? []).reduce((prev, curr) => {
      return prev + curr.quantity * curr.price;
    }, 0);
  }, [products]);

  const total = useMemo(() => {
    return sum - (discount ?? 0);
  }, [sum, discount]);

  const due = useMemo(() => {
    return total - paid;
  }, [paid, total]);

  const payingMethods = useMemo(() => {
    return Object.keys(PaymentMethod).map((key) => ({
      label: PaymentMethod[key as keyof typeof PaymentMethod],
      value: PaymentMethodCode[key as keyof typeof PaymentMethod],
    }));
  }, []);

  //* Effect
  useEffect(() => {
    methods.setValue("total", total);
    methods.setValue("paid", total);
  }, [total, methods]);

  useEffect(() => {
    methods.setValue("due", due);
  }, [methods, due]);

  return (
    <div className="u-m-t-24">
      <Heading type="h4" modifiers={["20x30"]}>
        Sum: {commafy(sum)}
      </Heading>
      <div className="u-d-flex u-m-t-16">
        <div className="u-m-r-8">
          <Heading type="h6" modifiers={["20x30"]}>
            Discount:{" "}
          </Heading>
        </div>
        <Controller
          control={methods.control}
          name="discount"
          defaultValue={0}
          rules={{
            required: FORM_VALIDATION.REQUIRED,
          }}
          render={({
            field: { ref, value, onBlur, onChange },
            fieldState: { error },
          }) => (
            <Input
              id="order-product-table-discount"
              type="number"
              ref={ref}
              value={value}
              onBlur={onBlur}
              onChange={(e) =>
                onChange(e.target.value ? Number(e.target.value) : "")
              }
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-m-t-16">
        <Heading type="h4">Total: {commafy(total)}</Heading>
      </div>
      <div className="u-d-flex u-m-t-8 u-flex-ai-center">
        <div className="u-m-r-8">
          <Heading type="h6" modifiers={["20x30"]}>
            Payment method:{" "}
          </Heading>
        </div>
        <Controller
          control={methods.control}
          name="paymentMethod"
          rules={{
            required: FORM_VALIDATION.REQUIRED,
          }}
          defaultValue={payingMethods[0]}
          render={({
            field: { value, onBlur, onChange },
            fieldState: { error },
          }) => (
            <Select
              id="order-paymentMethod"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              options={payingMethods.map((ele) => ({
                value: ele.value,
                label: ele.label,
              }))}
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-d-flex u-m-t-16">
        <div className="u-m-r-8">
          <Heading type="h6" modifiers={["20x30"]}>
            Paid:{" "}
          </Heading>
        </div>
        <Controller
          control={methods.control}
          name={`paid`}
          defaultValue={0}
          rules={{
            required: FORM_VALIDATION.REQUIRED,
          }}
          render={({
            field: { ref, value, onBlur, onChange },
            fieldState: { error },
          }) => (
            <Input
              id="order-product-table-paid"
              type="number"
              ref={ref}
              value={value}
              onBlur={onBlur}
              onChange={(e) =>
                onChange(e.target.value ? Number(e.target.value) : "")
              }
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-m-t-16">
        <Heading type="h6" modifiers={["20x30"]}>
          Due: {commafy(due)}
        </Heading>
      </div>
    </div>
  );
};
