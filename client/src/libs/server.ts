import { store } from "@client/redux/store";
import { treaty } from "@elysiajs/eden";
import type { App } from "@server";
import { AUTHEN_TOKENS } from "./constants";
import { setUser } from "@client/redux/features/auth";

const GUEST_ROUTES = ["login", "register"];

export const server = treaty<App>(import.meta.env.VITE_SERVER ?? "", {
  onRequest(path) {
    const { user } = store.getState().auth;
    const accessToken = localStorage.getItem(AUTHEN_TOKENS.ACCESS);

    if (user && GUEST_ROUTES.every((ele) => !path.includes(ele)))
      return {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      };
  },
  onResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        store.dispatch(setUser(undefined));
      }
    }
  },
});
