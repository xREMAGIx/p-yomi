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
      <div style={{ minHeight: "100vh" }}>
        <Outlet />
      </div>
    );
  },
});
