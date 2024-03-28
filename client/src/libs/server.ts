import { store } from "@client/redux/store";
import { treaty } from "@elysiajs/eden";
import type { App } from "@server";
import { AUTHEN_TOKENS } from "./constants";

const GUEST_ROUTES = ["login", "register"];

export const server = treaty<App>("localhost:3000", {
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
});
