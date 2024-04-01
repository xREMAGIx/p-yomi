import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { inventoryTable } from "../db-schema";
import { metaPaginationSchema } from "./base";

export const baseSelectInventorySchema = createSelectSchema(inventoryTable);

export const baseInsertInventorySchema = createInsertSchema(inventoryTable);

export const listInventoryDataSchema = t.Object({
  data: t.Array(baseSelectInventorySchema),
  meta: metaPaginationSchema,
});

export const detailInventoryDataSchema = t.Object({
  data: baseSelectInventorySchema,
});

export const createInventoryParamSchema = t.Omit(baseInsertInventorySchema, [
  "id",
  "createdAt",
  "updatedAt",
]);

export const updateInventoryParamSchema = t.Omit(baseInsertInventorySchema, [
  "id",
  "createdAt",
  "updatedAt",
]);

export type InventoryData = Static<typeof baseSelectInventorySchema>;
export type InventoryListData = Static<typeof listInventoryDataSchema>;

export type GetDetailInventoryParams = {
  id: number;
};

export type CreateInventoryParams = Static<typeof createInventoryParamSchema>;
export type UpdateInventoryParams = Static<
  typeof updateInventoryParamSchema
> & {
  id: number;
};

//* Model
export const inventoryModel = new Elysia({ name: "inventory-model" }).model({
  "inventory.data": baseSelectInventorySchema,
});
