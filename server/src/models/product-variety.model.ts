import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { productVarietyTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectProductVarietySchema =
  createSelectSchema(productVarietyTable);

export const baseInsertProductVarietySchema =
  createInsertSchema(productVarietyTable);

export const listProductVarietyQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    barcode: t.Optional(t.String()),
    name: t.Optional(t.String()),
  }),
]);

export const listProductVarietyDataSchema = t.Object({
  data: t.Array(baseSelectProductVarietySchema),
  meta: metaPaginationSchema,
});

export const detailProductVarietyDataSchema = t.Object({
  data: baseSelectProductVarietySchema,
});

export const createProductVarietyParamSchema = t.Composite([
  t.Omit(baseInsertProductVarietySchema, [
    "id",
    "createdAt",
    "updatedAt",
    "price",
  ]),
  t.Object({
    price: t.Optional(t.Numeric()),
  }),
]);

export const updateProductVarietyParamSchema = t.Composite([
  t.Omit(baseInsertProductVarietySchema, [
    "id",
    "createdAt",
    "updatedAt",
    "price",
  ]),
  t.Object({
    price: t.Optional(t.Numeric()),
  }),
]);

export type ProductVarietyData = Static<typeof baseSelectProductVarietySchema>;

export type ProductVarietyListData = Static<
  typeof listProductVarietyDataSchema
>;

export type GetListProductVarietyParams = Static<
  typeof listProductVarietyQuerySchema
> & {
  sortBy: keyof ProductVarietyData;
};

export type GetDetailProductVarietyParams = {
  id: number;
};

export type CreateProductVarietyParams = Static<
  typeof createProductVarietyParamSchema
>;
export type UpdateProductVarietyParams = Static<
  typeof updateProductVarietyParamSchema
> & {
  id: number;
};

//* Model
export const productModel = new Elysia({ name: "product-variety-model" }).model(
  {
    "product-variety.data": baseSelectProductVarietySchema,
  }
);
