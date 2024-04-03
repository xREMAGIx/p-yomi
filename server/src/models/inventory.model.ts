import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { inventoryTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";
import { baseSelectProductSchema } from "./product.model";

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

export const createStockInventoryParamSchema = t.Object({
  warehouseId: t.Numeric(),
  products: t.Array(
    t.Object({ quantity: t.Optional(t.Number()), productId: t.Numeric() })
  ),
});

export const updateStockInventoryParamSchema = t.Object({
  warehouseId: t.Numeric(),
  products: t.Array(
    t.Object({ quantity: t.Optional(t.Number()), productId: t.Numeric() })
  ),
});

export const deleteStockInventoryParamSchema = t.Object({
  warehouseId: t.Numeric(),
  products: t.Array(
    t.Object({ quantity: t.Optional(t.Number()), productId: t.Numeric() })
  ),
});

export const getStockInWarehouseParamSchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    warehouseId: t.Numeric(),
  }),
]);

export const getStockInWarehouseDataSchema = t.Object({
  data: t.Array(
    t.Composite([
      baseSelectInventorySchema,
      t.Object({ product: t.Nullable(baseSelectProductSchema) }),
    ])
  ),
  meta: metaPaginationSchema,
});

export const updateInventoryConfigParamSchema = t.Object({
  configs: t.Array(
    t.Pick(baseSelectInventorySchema, [
      "id",
      "minimumStockLevel",
      "maximumStockLevel",
      "reorderPoint",
    ])
  ),
});

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

export type CreateStockInventoryParams = Static<
  typeof createStockInventoryParamSchema
>;

export type UpdateStockInventoryParams = Static<
  typeof updateStockInventoryParamSchema
>;

export type DeleteStockInventoryParams = Static<
  typeof deleteStockInventoryParamSchema
>;

export type GetStockInWarehouseParams = Static<
  typeof getStockInWarehouseParamSchema
>;

export type GetStockInWarehouseData = Static<
  typeof getStockInWarehouseDataSchema
>;

export type UpdateInventoryConfigParams = Static<
  typeof updateInventoryConfigParamSchema
>;

//* Model
export const inventoryModel = new Elysia({ name: "inventory-model" }).model({
  "inventory.data": baseSelectInventorySchema,
});
