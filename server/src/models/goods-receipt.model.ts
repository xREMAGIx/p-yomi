import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { goodsReceiptDetailTable, goodsReceiptTable } from "../db-schema";
import { metaPaginationSchema } from "./base";
import { baseSelectProductSchema } from "./product.model";
import { baseSelectWarehouseSchema } from "./warehouse.model";

export const baseSelectGoodsReceiptSchema =
  createSelectSchema(goodsReceiptTable);

export const baseInsertGoodsReceiptSchema =
  createInsertSchema(goodsReceiptTable);

export const baseSelectGoodsReceiptDetailSchema = createSelectSchema(
  goodsReceiptDetailTable
);

export const baseInsertGoodsReceiptDetailSchema = createInsertSchema(
  goodsReceiptDetailTable
);

export const goodsReceiptProductDataSchema = t.Composite([
  t.Omit(baseSelectGoodsReceiptDetailSchema, [
    "id",
    "createdAt",
    "updatedAt",
    "goodsReceiptId",
    "productId",
  ]),
  baseSelectProductSchema,
]);

export const selectGoodsReceiptSchema = t.Composite([
  t.Omit(baseSelectGoodsReceiptSchema, ["warehouseId"]),
  t.Object({
    warehouse: t.Nullable(baseSelectWarehouseSchema),
  }),
]);

export const goodsReceiptDataSchema = t.Object({
  data: baseSelectGoodsReceiptSchema,
});

export const listGoodsReceiptDataSchema = t.Object({
  data: t.Array(selectGoodsReceiptSchema),
  meta: metaPaginationSchema,
});

export const goodsReceiptDetailDataSchema = t.Composite([
  selectGoodsReceiptSchema,
  t.Object({
    products: t.Array(goodsReceiptProductDataSchema),
  }),
]);

export const detailGoodsReceiptDataSchema = t.Object({
  data: goodsReceiptDetailDataSchema,
});

export const createGoodsReceiptParamSchema = t.Composite([
  t.Omit(baseInsertGoodsReceiptSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({
    products: t.Array(
      t.Omit(baseInsertGoodsReceiptDetailSchema, [
        "id",
        "createdAt",
        "updatedAt",
        "goodsReceiptId",
      ])
    ),
  }),
]);

export const updateGoodsReceiptParamSchema = t.Omit(
  baseInsertGoodsReceiptSchema,
  ["id", "createdAt", "updatedAt"]
);

export type GoodsReceiptData = Static<typeof selectGoodsReceiptSchema>;
export type GoodsReceiptListData = Static<typeof listGoodsReceiptDataSchema>;
export type GoodsReceiptProductData = Static<
  typeof goodsReceiptProductDataSchema
>;
export type GoodsReceiptDetailData = Static<
  typeof goodsReceiptDetailDataSchema
>;

export type GetDetailGoodsReceiptParams = {
  id: number;
};

export type CreateGoodsReceiptParams = Static<
  typeof createGoodsReceiptParamSchema
>;
export type UpdateGoodsReceiptParams = Static<
  typeof updateGoodsReceiptParamSchema
> & {
  id: number;
};

//* Model
export const goodsReceiptModel = new Elysia({
  name: "goodsReceipt-model",
}).model({
  "goodsReceipt.data": detailGoodsReceiptDataSchema,
});
