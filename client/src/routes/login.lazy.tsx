import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Input from "@client/components/atoms/Input";
import Link from "@client/components/atoms/Link";
import { FORM_VALIDATION, REGEX } from "@client/libs/constants";
import { server } from "@client/libs/server";
import { setTokens, setUser } from "@client/redux/features/auth";
import { useAppDispatch } from "@client/redux/hooks";
import { LoginParams } from "@server/models/auth.model";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  //* Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //* Hook-form
  const methods = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //* Mutation
  const { isPending, mutate: loginMutation } = useMutation({
    mutationFn: (params: LoginParams) => server.api.v1.auth.login.post(params),
    onSuccess: (res) => {
      const { data, error } = res;
      if (error) throw error.value;

      dispatch(setUser(data.user));
      dispatch(setTokens(data.tokens));
      navigate({ to: "/" });
      methods.reset();

      toast.success("Login success!");
    },
  });

  //* Functions
  const onSubmit = async (form: LoginForm) => {
    loginMutation({
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="p-login u-p-16">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Heading>Login</Heading>
          <div className="u-m-t-16">
            <Controller
              control={methods.control}
              name="email"
              rules={{
                required: FORM_VALIDATION.REQUIRED,
                validate: {
                  isEmail: (value) => {
                    const reg = new RegExp(REGEX.EMAIL);
                    if (!reg.test(value)) {
                      return FORM_VALIDATION.EMAIL_INVALID;
                    }
                    return true;
                  },
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="login-email"
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
                  id="login-password"
                  label="Password"
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
      <div className="u-m-t-32">
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
