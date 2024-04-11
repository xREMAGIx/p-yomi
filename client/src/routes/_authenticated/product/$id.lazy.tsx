import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import InfoForm, { ProductInfoForm } from "@client/containers/product/InfoForm";
import { TOAST_SUCCESS_MESSAGE } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { productQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useTranslation } from "@client/libs/translation";
import { UpdateProductParams } from "@server/models/product.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
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
  useQuery({
    queryKey: [...productQueryKeys.detail(id)],
    queryFn: async () => {
      const { data, error } = await server.api.v1.product({ id: id }).get();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      methods.reset({
        name: data.data.name,
        barcode: data.data.barcode ?? "",
        description: data.data.description ?? "",
        price: data.data.price,
      });
      return data.data;
    },
  });

  //* Mutation
  const { mutate: updateMutate, isPending: isLoadingUpdate } = useMutation({
    mutationKey: [...productQueryKeys.update(id)],
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

  //* Functions
  const onSubmit = (form: ProductInfoForm) => {
    updateMutate({
      ...form,
      id: Number(id),
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
      <div className="p-productDetail_form">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="u-m-t-16">
              <Heading>{t("title.productDetail")}</Heading>
            </div>
            <InfoForm />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
