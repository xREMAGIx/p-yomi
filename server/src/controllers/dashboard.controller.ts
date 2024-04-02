import { Elysia } from "elysia";
import { authenticatePlugin, servicesPlugin } from "../libs/plugins";
import {
  dashboardModel,
  inventoryDashboardDataSchema,
  productDashboardDataSchema,
} from "../models/dashboard.model";

export const dashboardRoutes = new Elysia({
  name: "dashboard",
}).group(
  `api/v1/dashboard`,
  {
    detail: {
      tags: ["Dashboard"],
      security: [{ JwtAuth: [] }],
    },
  },
  (app) =>
    app
      .use(authenticatePlugin)
      .use(servicesPlugin)
      .use(dashboardModel)
      .get(
        "/product",
        async ({ productService }) => {
          const total = await productService.getTotal();

          return {
            total,
          };
        },
        {
          response: productDashboardDataSchema,
          detail: {
            summary: "Get Product info in dashboard",
          },
        }
      )
      .get(
        "/inventory",
        async ({ inventoryService }) => {
          const total = await inventoryService.getTotal();

          return {
            total,
          };
        },
        {
          response: inventoryDashboardDataSchema,
          detail: {
            summary: "Get Product info in dashboard",
          },
        }
      )
);
