import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import { CustomerInfoForm } from "@client/components/pages/customer/CustomerInfoForm";
import { TOAST_SUCCESS_MESSAGE } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { customerQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { CreateCustomerParams } from "@server/models/customer.model";
import { useMutation } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/_authenticated/customer/create")({
  component: CustomerCreate,
});

function CustomerCreate() {
  //* Hooks
  const router = useRouter();
  const navigate = useNavigate();

  //* Hook-form
  const methods = useForm<CreateCustomerParams>();

  //* Mutation
  const { mutate: createMutate } = useMutation({
    mutationKey: customerQueryKeys.create(),
    mutationFn: async (params: CreateCustomerParams) => {
      const { error } = await server.api.v1.customer.index.post(params);

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      methods.reset();
      toast.success(TOAST_SUCCESS_MESSAGE.CREATE);
    },
  });

  //* Functions
  const onSubmit = (form: CreateCustomerParams) => {
    createMutate({
      ...form,
    });
  };

  return (
    <div className="p-customerCreate">
      <div className="u-d-flex u-flex-jc-between">
        <Button
          modifiers={["inline"]}
          variant="outlinePrimary"
          onClick={() => router.history.back()}
        >
          Back
        </Button>
        <Button modifiers={["inline"]} onClick={methods.handleSubmit(onSubmit)}>
          Submit
        </Button>
      </div>
      <div className="u-m-t-16">
        <Heading>Customer Create</Heading>
      </div>
      <div className="p-customerCreate_content">
        <div className="p-customerCreate_form u-m-t-32">
          <FormProvider {...methods}>
            <form>
              <CustomerInfoForm />
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
