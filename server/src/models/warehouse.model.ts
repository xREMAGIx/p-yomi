import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { warehouseTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectWarehouseSchema = createSelectSchema(warehouseTable);

export const baseInsertWarehouseSchema = createInsertSchema(warehouseTable);

export const listWarehouseQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    name: t.Optional(t.String()),
  }),
]);

export const listWarehouseDataSchema = t.Object({
  data: t.Array(baseSelectWarehouseSchema),
  meta: metaPaginationSchema,
});

export const detailWarehouseDataSchema = t.Object({
  data: baseSelectWarehouseSchema,
});

export const createWarehouseParamSchema = t.Omit(baseInsertWarehouseSchema, [
  "id",
  "createdAt",
  "updatedAt",
]);

export const updateWarehouseParamSchema = t.Omit(baseInsertWarehouseSchema, [
  "id",
  "createdAt",
  "updatedAt",
]);

export type WarehouseData = Static<typeof baseSelectWarehouseSchema>;
export type WarehouseListData = Static<typeof listWarehouseDataSchema>;

export type GetListWarehouseParams = Static<typeof listWarehouseQuerySchema> & {
  sortBy?: keyof WarehouseData;
};

export type GetDetailWarehouseParams = {
  id: number;
};

export type CreateWarehouseParams = Static<typeof createWarehouseParamSchema>;
export type UpdateWarehouseParams = Static<
  typeof updateWarehouseParamSchema
> & {
  id: number;
};

//* Model
export const warehouseModel = new Elysia({ name: "warehouse-model" }).model({
  "warehouse.data": baseSelectWarehouseSchema,
});
