import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { productTable } from "../db-schema";
import Elysia, { Static, t } from "elysia";
import { metaPaginationSchema } from "./base";

export const baseSelectProductSchema = createSelectSchema(productTable);

export const baseInsertProductSchema = createInsertSchema(productTable);

export const listProductDataSchema = t.Object({
  data: t.Array(baseSelectProductSchema),
  meta: metaPaginationSchema,
});

export const detailProductDataSchema = t.Object({
  data: baseSelectProductSchema,
});

export const createProductParamSchema = t.Union([
  t.Omit(baseInsertProductSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({
    price: t.Optional(t.Numeric()),
  }),
]);

export const updateProductParamSchema = t.Union([
  t.Omit(baseInsertProductSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({
    price: t.Optional(t.Numeric()),
  }),
]);

export type ProductData = Static<typeof baseSelectProductSchema>;
export type ProductListData = Static<typeof listProductDataSchema>;

export type GetDetailProductParams = {
  id: number;
};

export type CreateProductParams = Static<typeof createProductParamSchema>;
export type UpdateProductParams = Static<typeof updateProductParamSchema> & {
  id: number;
};

//* Model
export const productModel = new Elysia({ name: "product-model" }).model({
  "product.data": baseSelectProductSchema,
});
