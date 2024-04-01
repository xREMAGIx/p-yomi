import Layout from "@client/components/templates/Layout";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { validateAuthen } = context.authentication;
    const isLogged = await validateAuthen();
    if (!isLogged) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  },
});
