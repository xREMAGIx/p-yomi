import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Input from "@client/components/atoms/Input";
import { FORM_VALIDATION } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { warehouseQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { UpdateWarehouseParams } from "@server/models/warehouse.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Controller, FormProvider, useForm } from "react-hook-form";

export const Route = createLazyFileRoute("/_authenticated/warehouse/$id")({
  component: WarehouseDetail,
});

function WarehouseDetail() {
  //* Hooks
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();

  //* Hook-form
  const methods = useForm<UpdateWarehouseParams>({
    defaultValues: {
      name: "",
    },
  });

  //* Query
  useQuery({
    queryKey: [...warehouseQueryKeys.detail(id)],
    queryFn: async () => {
      const { data, error } = await server.api.v1.warehouse({ id: id }).get();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      methods.reset({
        name: data.data.name,
      });
      return data.data;
    },
  });

  //* Mutation
  const updateMutation = useMutation({
    mutationKey: [...warehouseQueryKeys.update(id)],
    mutationFn: async (params: UpdateWarehouseParams) => {
      const { error } = await server.api.v1.warehouse({ id: id }).put(params);

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }
    },
  });

  //* Functions
  const onSubmit = (form: UpdateWarehouseParams) => {
    updateMutation.mutate({
      ...form,
    });
  };

  return (
    <div className="p-warehouseDetail">
      <Button
        modifiers={["inline"]}
        variant="outlinePrimary"
        onClick={() => router.history.back()}
      >
        Back
      </Button>
      <div className="p-warehouseDetail_form">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="u-m-t-16">
              <Heading>Warehouse detail</Heading>
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
