import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Tabs, { Tab, TabPanel } from "@client/components/organisms/Tabs";
import AdvanceTable from "@client/components/templates/AdvanceTable";
import { AdvanceTableColumnType } from "@client/components/templates/AdvanceTable/types";
import InfoForm, { ProductInfoForm } from "@client/containers/product/InfoForm";
import { TOAST_SUCCESS_MESSAGE } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { productQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useTranslation } from "@client/libs/translation";
import {
  ProductInventoryData,
  ProductStatus,
  ProductStatusCode,
  UpdateProductParams,
} from "@server/models/product.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/_authenticated/product/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  //* Hooks
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();
  const { t } = useTranslation();

  //* States
  const [activeTabKey, setActiveTabKey] = useState("info");

  //* Hook-form
  const methods = useForm<ProductInfoForm>({
    defaultValues: {
      description: "",
      barcode: "",
      price: 0,
      name: "",
    },
  });

  //* Query
  const { data } = useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await server.api.v1.product({ id: id })[
        // eslint-disable-next-line no-unexpected-multiline
        "with-inventory"
      ].get();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      methods.reset({
        name: data.data.name,
        barcode: data.data.barcode ?? "",
        description: data.data.description ?? "",
        price: data.data.price,
        costPrice: data.data.costPrice,
        status: {
          label: t(
            `product.${ProductStatus[ProductStatusCode[data.data.status] as keyof typeof ProductStatus]}`
          ),
          value: data.data.status,
        },
      });
      return data.data;
    },
  });
  console.log("🚀 ~ ProductDetail ~ data:", data);

  //* Mutation
  const { mutate: updateMutate, isPending: isLoadingUpdate } = useMutation({
    mutationKey: productQueryKeys.update(id),
    mutationFn: async (params: UpdateProductParams) => {
      const { id, ...body } = params;
      const { error } = await server.api.v1.product({ id: id }).put(body);

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      toast.success(TOAST_SUCCESS_MESSAGE.UPDATE);
    },
  });

  //* Memos
  const tabsData = useMemo(
    () => [
      {
        id: "info",
        label: t("product.info"),
      },
      {
        id: "inventory",
        label: t("product.inventory"),
      },
    ],
    [t]
  );

  //* Functions
  const onSubmit = (form: ProductInfoForm) => {
    updateMutate({
      ...form,
      id: Number(id),
      status: form.status.value,
    });
  };

  return (
    <div className="p-productDetail">
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
          {t("action.update")}
        </Button>
      </div>
      <div className="u-m-t-16">
        <Heading>{t("title.productDetail")}</Heading>
      </div>
      <div className="u-m-t-24">
        <Tabs variableMutate={activeTabKey} modifiers={["primary"]}>
          {tabsData.map((item, index) => (
            <Tab
              key={`tab-${index.toString()}`}
              label={item.label}
              active={item.id === activeTabKey}
              handleClick={() => setActiveTabKey(item.id)}
            />
          ))}
        </Tabs>
        <TabPanel key={`tab-panel-info`} active>
          {(() => {
            switch (activeTabKey) {
              case "info":
                return (
                  <FormProvider {...methods}>
                    <ProductInfoTab />
                  </FormProvider>
                );
              case "inventory":
                return (
                  <FormProvider {...methods}>
                    <ProductInventoryTab data={data?.inventory ?? []} />
                  </FormProvider>
                );
              default:
                return null;
            }
          })()}
        </TabPanel>
      </div>
    </div>
  );
}

const ProductInfoTab: React.FC = () => {
  return (
    <div className="p-productDetail_form">
      <form>
        <InfoForm />
      </form>
    </div>
  );
};

interface ProductInventoryTabProps {
  data: ProductInventoryData[];
}

const ProductInventoryTab: React.FC<ProductInventoryTabProps> = ({ data }) => {
  //* Hooks

  //* Memos
  const headerData = useRef<AdvanceTableColumnType<ProductInventoryData>[]>([
    {
      colId: "warehouseId",
      colKeyValue: "warehouseId",
    },
    {
      colId: "warehouseName",
      colKeyValue: "warehouseName",
    },
    {
      colId: "quantityAvailable",
      colKeyValue: "quantityAvailable",
    },
  ]);

  return (
    <div className="p-productDetail_inventory">
      <AdvanceTable
        inlineSearchKeys={["warehouseName"]}
        headerData={headerData.current}
        data={data}
      />
    </div>
  );
};
