import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import InfoForm, { ProductInfoForm } from "@client/containers/product/InfoForm";
import { TOAST_SUCCESS_MESSAGE } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { productQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useTranslation } from "@client/libs/translation";
import { CreateProductParams } from "@server/models/product.model";
import { useMutation } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/_authenticated/product/create")({
  component: ProductCreate,
});

function ProductCreate() {
  //* Hooks
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

  //* Mutation
  const { isPending: isLoadingCreate, mutate: createMutate } = useMutation({
    mutationKey: productQueryKeys.create(),
    mutationFn: async (params: CreateProductParams) => {
      const { error } = await server.api.v1.product.index.post(params);

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      methods.reset();
      toast.success(TOAST_SUCCESS_MESSAGE.CREATE);
    },
  });

  //* Functions
  const onSubmit = (form: ProductInfoForm) => {
    createMutate({
      ...form,
    });
  };

  return (
    <div className="p-productCreate">
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
          isLoading={isLoadingCreate}
          onClick={methods.handleSubmit(onSubmit)}
        >
          {t("action.create")}
        </Button>
      </div>
      <div className="p-productCreate_form">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="u-m-t-16">
              <Heading>{t("title.productCreate")}</Heading>
            </div>
            <InfoForm />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
