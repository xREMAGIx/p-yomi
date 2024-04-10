import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import LoadingOverlay from "@client/components/molecules/LoadingOverlay";
import { CustomerInfoForm } from "@client/containers/customer/CustomerInfoForm";
import { TOAST_SUCCESS_MESSAGE } from "@client/libs/constants";
import { handleCheckAuthError } from "@client/libs/error";
import { customerQueryKeys } from "@client/libs/query";
import { server } from "@client/libs/server";
import { UpdateCustomerParams } from "@server/models/customer.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/_authenticated/customer/$id")({
  component: CustomerDetail,
});

function CustomerDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();

  //* Hook-form
  const methods = useForm<UpdateCustomerParams>();

  //* Query
  const { isFetching: isLoadingDetail } = useQuery({
    queryKey: customerQueryKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await server.api.v1.customer({ id: id }).get();

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      methods.reset({
        id: data.data.id,
        name: data.data.name,
        phone: data.data.phone,
        address: data.data.address,
        email: data.data.email,
        dateOfBirth: data.data.dateOfBirth,
      });

      return data.data;
    },
  });

  //* Mutation
  const { mutate: updateMutate } = useMutation({
    mutationKey: customerQueryKeys.update(id),
    mutationFn: async (params: UpdateCustomerParams) => {
      const { id: idParams, ...rest } = params;
      const { error } = await server.api.v1
        .customer({ id: idParams })
        .put(rest);

      if (error) {
        handleCheckAuthError(error, navigate);
        throw error.value;
      }

      toast.success(TOAST_SUCCESS_MESSAGE.UPDATE);
    },
  });

  //* Functions
  const onSubmit = (form: UpdateCustomerParams) => {
    updateMutate({
      ...form,
    });
  };

  return (
    <div className="p-customerDetail">
      <div className="u-d-flex u-flex-jc-between">
        <Button
          modifiers={["inline"]}
          variant="outlinePrimary"
          onClick={() => router.history.back()}
        >
          Back
        </Button>
        <Button modifiers={["inline"]} onClick={methods.handleSubmit(onSubmit)}>
          Update
        </Button>
      </div>
      <div className="u-m-t-16">
        <Heading>Customer Detail</Heading>
      </div>
      <div className="p-customerDetail_content u-position-relative">
        <LoadingOverlay isLoading={isLoadingDetail} modifiers={["outer-16"]} />
        <div className="p-customerDetail_form u-m-t-32">
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
