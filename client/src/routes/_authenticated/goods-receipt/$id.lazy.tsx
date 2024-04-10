import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Icon from "@client/components/atoms/Icon";
import Input from "@client/components/atoms/Input";
import Text from "@client/components/atoms/Text";
import LoadingOverlay from "@client/components/molecules/LoadingOverlay";
import Select from "@client/components/molecules/Select";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import {
  ProductModal,
  ProductModalRef,
} from "@client/containers/goods-receipt/ProductModal";
import {
  DATE_TIME_FORMAT,
  DEFAULT_PAGINATION,
  FORM_VALIDATION,
  TOAST_SUCCESS_MESSAGE,
} from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { goodsReceiptQueryKeys, warehouseQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import {
  GoodsReceiptProductData,
  UpdateGoodsReceiptParams,
} from "@server/models/goods-receipt.model";
import {
  GetListProductParams,
  ProductData,
} from "@server/models/product.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import dayjs from "dayjs";
import { useRef } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/_authenticated/goods-receipt/$id")({
  component: GoodsReceiptDetail,
});

interface SearchForm {
  search: string;
}

interface GoodsReceiptForm {
  warehouse: {
    value: number;
    label: string;
  } | null;
  products: (Omit<GoodsReceiptProductData, "id"> & { productId: number })[];
}

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
    id: "quantity",
    keyValue: "quantity",
    title: "Quantity",
  },
  {
    id: "action",
    keyValue: "action",
    title: "Action",
  },
];

function GoodsReceiptDetail() {
  //* Hooks
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();

  //* Refs
  const productModalRef = useRef<ProductModalRef>(null);
  const pagination = useRef({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });
  const warehousePagination = useRef({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });

  //* Hook-form
  const searchMethods = useForm<SearchForm>();
  const goodReceiptMethods = useForm<GoodsReceiptForm>();
  const {
    fields,
    append: fieldAppend,
    remove: fieldRemove,
    update: fieldUpdate,
    replace: fieldReplace,
  } = useFieldArray({
    control: goodReceiptMethods.control,
    name: "products",
  });

  //* Query
  const { isFetching: isLoadingDetail } = useQuery({
    queryKey: goodsReceiptQueryKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await server.api.v1["goods-receipt"]({
        id,
      }).get();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      goodReceiptMethods.reset({
        warehouse: data.data.warehouse
          ? {
              label: data.data.warehouse.name,
              value: data.data.warehouse.id,
            }
          : null,
      });

      fieldReplace(
        data.data.products.map((ele) => {
          const { id, ...rest } = ele;
          return {
            ...rest,
            productId: id,
          };
        })
      );

      return data.data;
    },
  });

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
  const { isPending: isLoadingSearch, mutate: searchMutate } = useMutation({
    mutationKey: goodsReceiptQueryKeys.searchProduct(),
    mutationFn: async (params: GetListProductParams) => {
      const { data, error } = await server.api.v1.product.index.get({
        query: {
          ...params,
        },
      });

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      pagination.current = {
        ...data.meta,
      };

      searchMethods.reset();

      if (data.data.length === 1) {
        handleAddProduct(data.data[0]);
        return;
      }

      if (data.data.length > 1) {
        productModalRef.current?.handleListProduct(data.data);
        productModalRef.current?.handleOpen();
      }
    },
  });

  const { isPending: isLoadingUpdate, mutate: updateMutate } = useMutation({
    mutationKey: goodsReceiptQueryKeys.update(id),
    mutationFn: async (params: UpdateGoodsReceiptParams) => {
      const { id, ...rest } = params;
      const { error } = await server.api.v1["goods-receipt"]({ id }).put({
        ...rest,
      });

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      toast.success(TOAST_SUCCESS_MESSAGE.UPDATE);
    },
  });

  //* Functions
  const onSearch = (form: SearchForm) => {
    if (!form.search) return;

    searchMutate({
      page: pagination.current.page,
      limit: pagination.current.limit,
      barcode: form.search,
    });
  };

  const onSubmit = (form: GoodsReceiptForm) => {
    if (!form.warehouse) return;

    updateMutate({
      id: Number(id),
      warehouseId: form.warehouse.value,
      products: form.products,
    });
  };

  const handleAddProduct = (product: ProductData) => {
    const fieldIdx = fields.findIndex((ele) => ele.productId === product.id);
    if (fieldIdx > -1) {
      fieldUpdate(fieldIdx, {
        ...fields[fieldIdx],
        quantity: fields[fieldIdx].quantity + 1,
      });

      return;
    }

    const { id, ...rest } = product;

    fieldAppend({
      ...rest,
      productId: id,
      quantity: 1,
    });
  };

  return (
    <div className="p-goodsReceiptDetail">
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
          disabled={!fields.length}
          isLoading={isLoadingUpdate}
          onClick={goodReceiptMethods.handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </div>
      <div className="u-m-t-16">
        <Heading>Goods Receipt Detail</Heading>
      </div>
      <div className="p-goodsReceiptDetail_content u-position-relative">
        <LoadingOverlay isLoading={isLoadingDetail} modifiers={["outer-16"]} />
        <div className="p-goodsReceiptDetail_warehouse u-m-t-32">
          <Controller
            control={goodReceiptMethods.control}
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
                isDisabled
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
        <div className="p-goodsReceiptDetail_input u-m-t-16">
          <FormProvider {...searchMethods}>
            <form onSubmit={searchMethods.handleSubmit(onSearch)}>
              <div className="u-d-flex u-flex-ai-start">
                <div className="u-flex-1">
                  <Controller
                    control={searchMethods.control}
                    name="search"
                    defaultValue={""}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        id="goods-receipt-input"
                        label="Search"
                        {...field}
                        error={error?.message}
                      />
                    )}
                  />
                </div>
                <div className="u-m-l-8 u-m-t-24">
                  <Button
                    isLoading={isLoadingSearch}
                    type="submit"
                    modifiers={["inline"]}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
        <div className="p-goodsReceiptDetail_table u-m-t-32">
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
            {fields?.map((field, index) => (
              <TableRow key={`row-${field.id}`}>
                {headerData.map((col) => {
                  const keyVal = col.keyValue as keyof typeof field;
                  const data = field[keyVal];

                  if (
                    keyVal === "createdAt" ||
                    keyVal === "updatedAt" ||
                    data instanceof Date
                  ) {
                    return (
                      <TableCell key={`${field.id}-${col.keyValue}`}>
                        <Text type="span">
                          {dayjs(data).format(DATE_TIME_FORMAT.DATE_TIME)}
                        </Text>
                      </TableCell>
                    );
                  }

                  if (col.keyValue === "quantity") {
                    return (
                      <TableCell key={`${field.id}-${col.keyValue}`}>
                        <Controller
                          control={goodReceiptMethods.control}
                          name={`products.${index}.quantity`}
                          defaultValue={1}
                          rules={{
                            required: FORM_VALIDATION.REQUIRED,
                          }}
                          render={({
                            field: { ref, value, onBlur, onChange },
                            fieldState: { error },
                          }) => (
                            <Input
                              id="goods-receipt-input"
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

                  if (col.keyValue === "action") {
                    return (
                      <TableCell key={`${field.id}-${col.keyValue}`}>
                        <Button
                          variant="icon"
                          modifiers={["inline"]}
                          onClick={() => fieldRemove(index)}
                        >
                          <Icon iconName="close" />
                        </Button>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={`${field.id}-${col.keyValue}`}>
                      <Text type="span">{data}</Text>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </Table>
        </div>
      </div>
      <div className="p-goodsReceiptDetail_modal">
        <ProductModal
          ref={productModalRef}
          handleAddProduct={handleAddProduct}
        />
      </div>
    </div>
  );
}
