import Button from "@client/components/atoms/Button";
import Input from "@client/components/atoms/Input";
import { FORM_VALIDATION } from "@client/libs/constants";
import { server } from "@client/libs/server";
import { setTokens, setUser } from "@client/redux/features/auth";
import { useAppDispatch } from "@client/redux/hooks";
import { LoginParams } from "@server/models/auth.model";
import { useMutation } from "@tanstack/react-query";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
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
    <div className="p-2">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <h3>Login</h3>
          <div className="u-m-t-16">
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
        <Link to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}
