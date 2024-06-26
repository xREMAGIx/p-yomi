import Button from "@client/components/atoms/Button";
import Icon from "@client/components/atoms/Icon";
import Input from "@client/components/atoms/Input";
import Text from "@client/components/atoms/Text";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import {
  DEFAULT_PAGINATION,
  FORM_VALIDATION,
  TOAST_ERROR_MESSAGE,
} from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { commafy } from "@client/libs/functions";
import { orderQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { OrderProductData } from "@server/models/order.model";
import {
  GetListProductParams,
  ProductWithInventoryData,
} from "@server/models/product.model";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { ProductModal, ProductModalRef } from "./ProductModal";
import toast from "react-hot-toast";

const headerData = [
  {
    id: "name",
    keyValue: "name",
    title: "Name",
  },
  {
    id: "barcode",
    keyValue: "barcode",
    title: "Barcode",
  },
  {
    id: "available",
    keyValue: "available",
    title: "Available",
  },
  {
    id: "quantity",
    keyValue: "quantity",
    title: "Quantity",
  },
  {
    id: "price",
    keyValue: "price",
    title: "Price",
  },
  {
    id: "discount",
    keyValue: "discount",
    title: "Discount",
  },
  {
    id: "total",
    keyValue: "total",
    title: "Total",
  },
  {
    id: "action",
    keyValue: "action",
    title: "Action",
  },
] as const;

interface SearchForm {
  search: string;
}

interface OrderForm {
  warehouse: {
    value: number;
    label: string;
  };
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
  discount: number;
  note: string;
}

interface ProductTableProps {
  selectedWarehouseId?: number;
}

export interface ProductTableRef {}

export const ProductTable = forwardRef<ProductTableRef, ProductTableProps>(
  ({ selectedWarehouseId }, ref) => {
    //* Hooks
    const navigate = useNavigate();

    //* States

    //* Refs
    const productModalRef = useRef<ProductModalRef>(null);
    const pagination = useRef({
      limit: DEFAULT_PAGINATION.LIMIT,
      page: DEFAULT_PAGINATION.PAGE,
      total: 0,
      totalPages: 1,
    });

    //* Hook-form
    const searchMethods = useForm<SearchForm>();
    const orderMethods = useFormContext<OrderForm>();
    const {
      fields,
      append: fieldAppend,
      remove: fieldRemove,
      update: fieldUpdate,
    } = useFieldArray({
      control: orderMethods.control,
      name: "products",
    });

    //* Mutations
    const { isPending: isLoadingSearch, mutate: searchMutate } = useMutation({
      mutationKey: orderQueryKeys.searchProduct(),
      mutationFn: async (params: GetListProductParams) => {
        const { data, error } = await server.api.v1.product[
          "with-inventory"
        ].get({
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

        if (!data.data.length) {
          toast.error(TOAST_ERROR_MESSAGE.PRODUCT_NOT_FOUND);
          return;
        }

        if (
          data.data.length === 1 &&
          (data.data[0].barcode === params.barcode ||
            data.data[0].name === params.name)
        ) {
          handleAddProduct(data.data[0]);
          return;
        }

        if (data.data.length > 0) {
          productModalRef.current?.handleListProduct(data.data);
          productModalRef.current?.handleOpen();
        }
      },
    });

    //* Functions
    const onSearch = (form: SearchForm) => {
      if (!form.search) return;

      searchMutate({
        page: pagination.current.page,
        limit: pagination.current.limit,
        barcode: form.search,
        name: form.search,
      });
    };

    const handleAddProduct = (product: ProductWithInventoryData) => {
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
        discount: 0,
      });
    };

    //* Imperative hanlder
    useImperativeHandle(ref, () => ({}));

    return (
      <div className="c-order_productTable">
        <div className="c-order_productTable_search u-m-t-16">
          <form onSubmit={searchMethods.handleSubmit(onSearch)}>
            <div className="u-d-flex u-flex-ai-start">
              <div className="u-flex-1">
                <Controller
                  control={searchMethods.control}
                  name="search"
                  defaultValue={""}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      id="order-product-search"
                      label="Product search"
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
        </div>
        <div className="c-order_productTable_table u-m-t-32">
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
                  const keyVal = col.keyValue;

                  if (keyVal === "available") {
                    const inventoryData = field.inventory.reduce(
                      (
                        prev: {
                          currentWarehouse: number;
                          total: number;
                        },
                        curr
                      ) => {
                        return {
                          currentWarehouse:
                            field.inventory.find(
                              (ele) => ele.warehouseId === selectedWarehouseId
                            )?.quantityAvailable ?? -1,
                          total: prev.total + curr.quantityAvailable,
                        };
                      },
                      {
                        currentWarehouse: -1,
                        total: 0,
                      }
                    );

                    return (
                      <TableCell key={`${field.id}-${keyVal}`}>
                        <Text type="span">
                          {inventoryData.currentWarehouse}/{inventoryData.total}
                        </Text>
                      </TableCell>
                    );
                  }

                  if (keyVal === "price" || keyVal === "discount") {
                    return (
                      <TableCell key={`${field.id}-${keyVal}`}>
                        <Controller
                          control={orderMethods.control}
                          name={`products.${index}.${keyVal}`}
                          defaultValue={0}
                          rules={{
                            required: FORM_VALIDATION.REQUIRED,
                          }}
                          render={({
                            field: { ref, value, onBlur, onChange },
                            fieldState: { error },
                          }) => (
                            <Input
                              id={`order-product-table-${col.keyValue}`}
                              type="number"
                              ref={ref}
                              value={value ?? 0}
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

                  if (keyVal === "quantity") {
                    return (
                      <TableCell key={`${field.id}-${col.keyValue}`}>
                        <Controller
                          control={orderMethods.control}
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
                              id="order-product-table-quantity"
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

                  if (keyVal === "total") {
                    return (
                      <TotalTableCell
                        key={`${field.id}-${col.keyValue}`}
                        fieldIdx={index}
                      />
                    );
                  }

                  if (keyVal === "action") {
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
                      <Text type="span">{field[keyVal]}</Text>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </Table>
        </div>
        <div className="c-order_productTable_modal">
          <ProductModal
            ref={productModalRef}
            selectedWarehouseId={selectedWarehouseId}
            handleAddProduct={handleAddProduct}
          />
        </div>
      </div>
    );
  }
);

interface TotalTableCellProps {
  fieldIdx: number;
}

const TotalTableCell: React.FC<TotalTableCellProps> = ({ fieldIdx }) => {
  const methods = useFormContext();
  const price = useWatch({
    control: methods.control,
    name: `products.${fieldIdx}.price`,
  });

  const quantity = useWatch({
    control: methods.control,
    name: `products.${fieldIdx}.quantity`,
  });

  return (
    <TableCell>
      <Text type="span">{commafy(price * quantity)}</Text>
    </TableCell>
  );
};
