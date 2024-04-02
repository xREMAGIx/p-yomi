import dayjs from "dayjs";
import { Elysia } from "elysia";
import {
  authenticatePlugin,
  servicesPlugin,
  tokenPlugin,
} from "../libs/plugins";
import {
  authModel,
  getProfileDataSchema,
  loginDataSchema,
  loginParamsSchema,
  registerDataSchema,
  registerParamsSchema,
} from "../models/auth.model";

export const authRoutes = new Elysia({
  name: "auth",
}).group(
  `api/v1/auth`,
  {
    detail: {
      tags: ["Auth"],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(authModel)
      .use(tokenPlugin)
      //* Login
      .post(
        "/login",
        async ({ body, accessJwt, refreshJwt, authService }) => {
          const { email, password } = body;

          const result = await authService.login({
            email,
            password,
          });

          const accessToken = await accessJwt.sign({
            sub: result.id.toString(),
            iat: dayjs().unix(),
            type: "access",
            role: result.role.toString(),
          });

          const refreshToken = await refreshJwt.sign({
            sub: result.id.toString(),
            iat: dayjs().unix(),
            type: "access",
            role: result.role.toString(),
          });

          return {
            user: result,
            tokens: {
              access: accessToken,
              refresh: refreshToken,
            },
          };
        },
        {
          body: loginParamsSchema,
          response: loginDataSchema,
          detail: {
            summary: "Login",
          },
        }
      )
      //* Register
      .post(
        "/register",
        async ({ body, authService }) => {
          const { username, email, password } = body;
          const result = await authService.register({
            username,
            email,
            password,
          });

          return {
            data: result,
          };
        },
        {
          body: registerParamsSchema,
          response: registerDataSchema,
          detail: {
            summary: "Register",
          },
        }
      )

      .use(authenticatePlugin)
      //* Profile
      .get(
        "/profile",
        async ({ userId, authService }) => {
          const result = await authService.getProfile({
            userId: userId,
          });

          return {
            data: result,
          };
        },
        {
          response: getProfileDataSchema,
          detail: {
            summary: "Get Profile",
            security: [{ JwtAuth: [] }],
          },
        }
      )
);
