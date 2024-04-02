import Elysia, { Static, t } from "elysia";

export const productDashboardDataSchema = t.Object({
  total: t.Number(),
});

export const inventoryDashboardDataSchema = t.Object({
  total: t.Number(),
});

export type ProductDashboardData = Static<typeof productDashboardDataSchema>;
export type InventoryDashboardData = Static<
  typeof inventoryDashboardDataSchema
>;

//* Model
export const dashboardModel = new Elysia({ name: "dashboard-model" }).model({
  "dashboard.product": productDashboardDataSchema,
  "dashboard.inventory": inventoryDashboardDataSchema,
});
