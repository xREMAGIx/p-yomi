import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { productTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectProductSchema = createSelectSchema(productTable);

export const baseInsertProductSchema = createInsertSchema(productTable);

export const listProductQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    barcode: t.Optional(t.String()),
    name: t.Optional(t.String()),
  }),
]);

export const listProductDataSchema = t.Object({
  data: t.Array(baseSelectProductSchema),
  meta: metaPaginationSchema,
});

export const detailProductDataSchema = t.Object({
  data: baseSelectProductSchema,
});

export const createProductParamSchema = t.Composite([
  t.Omit(baseInsertProductSchema, ["id", "createdAt", "updatedAt", "price"]),
  t.Object({
    price: t.Optional(t.Numeric()),
  }),
]);

export const updateProductParamSchema = t.Composite([
  t.Omit(baseInsertProductSchema, ["id", "createdAt", "updatedAt", "price"]),
  t.Object({
    price: t.Optional(t.Numeric()),
  }),
]);

export const listProductWithInventoryQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    barcode: t.Optional(t.String()),
    name: t.Optional(t.String()),
  }),
]);

export const productWithInventoryDataSchema = t.Composite([
  baseSelectProductSchema,
  t.Object({
    totalAvailable: t.Number(),
    inventory: t.Array(
      t.Object({
        quantityAvailable: t.Number(),
        warehouseId: t.Numeric(),
        warehouseName: t.String(),
      })
    ),
  }),
]);

export const listProductWithInventoryDataSchema = t.Object({
  data: t.Array(productWithInventoryDataSchema),
  meta: metaPaginationSchema,
});

export type ProductData = Static<typeof baseSelectProductSchema>;

export type ProductListData = Static<typeof listProductDataSchema>;

export type GetListProductParams = Static<typeof listProductQuerySchema> & {
  sortBy: keyof ProductData;
};

export type GetDetailProductParams = {
  id: number;
};

export type CreateProductParams = Static<typeof createProductParamSchema>;
export type UpdateProductParams = Static<typeof updateProductParamSchema> & {
  id: number;
};

export type GetListProductWithInventoryParams = Static<
  typeof listProductWithInventoryQuerySchema
>;

export type ProductWithInventoryData = Static<
  typeof productWithInventoryDataSchema
>;

export type GetListProductWithInventoryData = Static<
  typeof listProductWithInventoryDataSchema
>;

//* Model
export const productModel = new Elysia({ name: "product-model" }).model({
  "product.data": baseSelectProductSchema,
});
