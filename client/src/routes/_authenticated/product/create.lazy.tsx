import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Input from "@client/components/atoms/Input";
import { FORM_VALIDATION, TOAST_SUCCESS_MESSAGE } from "@client/libs/constants";
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
import { Controller, FormProvider, useForm } from "react-hook-form";
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
  const methods = useForm<CreateProductParams>({
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
  const onSubmit = (form: CreateProductParams) => {
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
              <Heading>{t("title.createProduct")}</Heading>
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
                    id="product-create-name"
                    label="Name"
                    {...field}
                    error={error?.message}
                  />
                )}
              />
            </div>
            <div className="u-m-t-8">
              <Controller
                control={methods.control}
                name="barcode"
                rules={{
                  required: FORM_VALIDATION.REQUIRED,
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    id="product-create-barcode"
                    label="Barcode"
                    {...field}
                    value={field.value ?? ""}
                    error={error?.message}
                  />
                )}
              />
            </div>
            <div className="u-m-t-8">
              <Controller
                control={methods.control}
                name="description"
                rules={{
                  required: FORM_VALIDATION.REQUIRED,
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    id="product-create-description"
                    label="Description"
                    {...field}
                    value={field.value ?? ""}
                    error={error?.message}
                  />
                )}
              />
            </div>
            <div className="u-m-t-8">
              <Controller
                control={methods.control}
                name="price"
                rules={{
                  required: FORM_VALIDATION.REQUIRED,
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    id="product-create-price"
                    label="Price"
                    {...field}
                    error={error?.message}
                  />
                )}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
