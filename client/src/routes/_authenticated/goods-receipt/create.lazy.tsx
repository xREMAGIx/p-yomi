import Button from "@client/components/atoms/Button";
import Icon from "@client/components/atoms/Icon";
import Input from "@client/components/atoms/Input";
import Text from "@client/components/atoms/Text";

import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import { DEFAULT_PAGINATION, FORM_VALIDATION } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { productQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

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
    keyValue: "createdAt",
    title: "Created at",
  },
  {
    id: "action",
    keyValue: "action",
    title: "Action",
  },
];

export const Route = createLazyFileRoute(
  "/_authenticated/goods-receipt/create"
)({
  component: GoodsReceiptCreate,
});

interface SearchForm {
  search: string;
}

function GoodsReceiptCreate() {
  //* Hooks
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
  const searchMethods = useForm<SearchForm>();
  const listMethods = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: listMethods.control,
      name: "products",
    }
  );

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

  //* Functions
  const onSubmit = (form: SearchForm) => {};

  const handleRemove = () => {};

  return (
    <div className="p-goodsReceiptCreate">
      <div className="u-d-flex u-flex-jc-between">
        <Button
          modifiers={["inline"]}
          variant="outlinePrimary"
          onClick={() => router.history.back()}
        >
          Back
        </Button>
        <Button modifiers={["inline"]} onClick={() => router.history.back()}>
          Submit
        </Button>
      </div>
      <div className="p-goodsReceiptCreate_input u-m-t-32">
        <FormProvider {...searchMethods}>
          <form onSubmit={searchMethods.handleSubmit(onSubmit)}>
            <div className="u-d-flex u-flex-ai-start">
              <div className="u-flex-1">
                <Controller
                  control={searchMethods.control}
                  name="password"
                  defaultValue={""}
                  rules={{
                    required: FORM_VALIDATION.REQUIRED,
                  }}
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
                <Button type="submit" modifiers={["inline"]}>
                  Search
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      <div className="p-goodsReceiptCreate_table u-m-t-32">
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
          {fields?.map((field) => (
            <TableRow key={`row-${field.id}`}>
              {headerData.map((col) => {
                const keyVal = col.keyValue as keyof typeof field;
                const data = field[keyVal];

                if (col.keyValue === "action") {
                  return (
                    <TableCell key={`${field.id}-${col.keyValue}`}>
                      <Button
                        variant="icon"
                        modifiers={["inline"]}
                        onClick={handleRemove}
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
  );
}
