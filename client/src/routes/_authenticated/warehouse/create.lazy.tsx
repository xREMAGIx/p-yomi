import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Input from "@client/components/atoms/Input";
import { FORM_VALIDATION, TOAST_SUCCESS_MESSAGE } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { warehouseQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { useTranslation } from "@client/libs/translation";
import { CreateWarehouseParams } from "@server/models/warehouse.model";
import { useMutation } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/_authenticated/warehouse/create")({
  component: WarehouseCreate,
});

function WarehouseCreate() {
  //* Hooks
  const router = useRouter();
  const navigate = useNavigate();
  const { t } = useTranslation();

  //* Hook-form
  const methods = useForm<CreateWarehouseParams>({
    defaultValues: {
      name: "",
    },
  });

  //* Mutation
  const createMutation = useMutation({
    mutationKey: warehouseQueryKeys.create(),
    mutationFn: async (params: CreateWarehouseParams) => {
      const { error } = await server.api.v1.warehouse.index.post(params);

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      methods.reset();
      toast.success(TOAST_SUCCESS_MESSAGE.CREATE);
    },
  });

  //* Functions
  const onSubmit = (form: CreateWarehouseParams) => {
    createMutation.mutate({
      ...form,
    });
  };

  return (
    <div className="p-warehouseCreate">
      <Button
        modifiers={["inline"]}
        variant="outlinePrimary"
        onClick={() => router.history.back()}
      >
        {t("action.back")}
      </Button>
      <div className="p-warehouseCreate_form">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="u-m-t-16">
              <Heading>{t("title.warehouseCreate")}</Heading>
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
            <div className="u-m-t-32">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
