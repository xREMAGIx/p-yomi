import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Input from "@client/components/atoms/Input";
import Link from "@client/components/atoms/Link";
import { FORM_VALIDATION } from "@client/libs/constants";
import { server } from "@client/libs/server";
import { RegisterParams } from "@server/models/auth.model";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/register")({
  component: Register,
});

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  rePassword: string;
}

function Register() {
  //* Hooks

  //* Hook-form
  const methods = useForm<RegisterForm>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      rePassword: "",
    },
  });

  //* Mutation
  const { isPending, mutate: registerMutation } = useMutation({
    mutationFn: (params: RegisterParams) =>
      server.api.v1.auth.register.post(params),
    onSuccess: (res) => {
      const { error } = res;
      if (error) throw error.value;

      methods.reset();

      toast.success("Register success!");
    },
  });

  //* Functions
  const onSubmit = async (form: RegisterForm) => {
    registerMutation({
      username: form.username,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="p-register u-p-16">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Heading>Register</Heading>
          <div className="u-m-t-16">
            <Controller
              control={methods.control}
              name="username"
              rules={{
                required: FORM_VALIDATION.REQUIRED,
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="register-username"
                  label="Username"
                  {...field}
                  error={error?.message}
                />
              )}
            />
          </div>
          <div className="u-m-t-8">
            <Controller
              control={methods.control}
              name="email"
              rules={{
                required: FORM_VALIDATION.REQUIRED,
                validate: {
                  isEmail: (value) => {
                    const reg = new RegExp(
                      "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
                    );
                    if (!reg.test(value)) {
                      return FORM_VALIDATION.EMAIL_INVALID;
                    }
                    return true;
                  },
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="register-email"
                  label="Email"
                  {...field}
                  error={error?.message}
                />
              )}
            />
          </div>
          <div className="u-m-t-8">
            <Controller
              control={methods.control}
              name="password"
              rules={{
                required: FORM_VALIDATION.REQUIRED,
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="register-password"
                  label="Password"
                  type="password"
                  {...field}
                  error={error?.message}
                />
              )}
            />
          </div>
          <div className="u-m-t-8">
            <Controller
              control={methods.control}
              name="rePassword"
              rules={{
                required: FORM_VALIDATION.REQUIRED,
                validate: {
                  isMatch: (val) => {
                    if (val !== methods.getValues("password")) {
                      return FORM_VALIDATION.RE_PASSWORD_UNMATCH;
                    }
                    return true;
                  },
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="register-rePassword"
                  label="Re-enter password"
                  type="password"
                  {...field}
                  error={error?.message}
                />
              )}
            />
          </div>
          <div className="u-m-t-32">
            <Button type="submit" isLoading={isPending}>
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
      <div className="u-m-t-32 u-d-flex u-flex-jc-center">
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
