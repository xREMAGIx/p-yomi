import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Input from "@client/components/atoms/Input";
import { FORM_VALIDATION } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { productQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { UpdateProductParams } from "@server/models/product.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Controller, FormProvider, useForm } from "react-hook-form";

export const Route = createLazyFileRoute("/_authenticated/product/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  //* Hooks
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();

  //* Hook-form
  const methods = useForm<UpdateProductParams>({
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
        barcode: data.data.barcode,
        description: data.data.description,
        price: data.data.price,
      });
      return data.data;
    },
  });

  //* Mutation
  const updateMutation = useMutation({
    mutationKey: [...productQueryKeys.update(id)],
    mutationFn: async (params: UpdateProductParams) => {
      const { error } = await server.api.v1.product({ id: id }).put(params);

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }
    },
  });

  //* Functions
  const onSubmit = (form: UpdateProductParams) => {
    updateMutation.mutate({
      ...form,
    });
  };

  return (
    <div className="p-productDetail">
      <Button
        modifiers={["inline"]}
        variant="outlinePrimary"
        onClick={() => router.history.back()}
      >
        Back
      </Button>
      <div className="p-productDetail_form">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="u-m-t-16">
              <Heading>Product detail</Heading>
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
            <div className="u-m-t-32">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
