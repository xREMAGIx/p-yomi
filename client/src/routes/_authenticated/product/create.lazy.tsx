import Button from "@client/components/atoms/Button";
import Input from "@client/components/atoms/Input";
import Datepicker from "@client/components/molecules/DatePicker";
import { FORM_VALIDATION } from "@client/libs/constants";
import { server } from "@client/libs/server";
import { CreateProductParams } from "@server/models/product.model";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { Controller, FormProvider, useForm } from "react-hook-form";

export const Route = createLazyFileRoute("/_authenticated/product/create")({
  component: ProductCreate,
});

function ProductCreate() {
  //* Hooks
  const router = useRouter();

  //* Hook-form
  const methods = useForm<CreateProductParams>({
    defaultValues: {
      description: "",
      barcode: "",
      price: 0,
      expiryDate: null,
      name: "",
    },
  });

  //* Mutation
  const createMutation = useMutation({
    mutationFn: (params: CreateProductParams) =>
      server.api.v1.product.index.post(params),
    onSuccess: () => {
      methods.reset();
    },
  });

  //* Functions
  const onSubmit = (form: CreateProductParams) => {
    createMutation.mutate({
      ...form,
    });
  };

  return (
    <div className="p-productCreate">
      <Button
        modifiers={["inline"]}
        variant="outlinePrimary"
        onClick={() => router.history.back()}
      >
        Back
      </Button>
      <div className="p-productCreate_form">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <h3>Create product</h3>
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
            <div className="u-m-t-8">
              <Controller
                control={methods.control}
                name="expiryDate"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Datepicker
                    id={"product-create-date"}
                    label="Expiry date"
                    value={value}
                    handleChangeDate={onChange}
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
