import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { goodsReceiptDetailTable, goodsReceiptTable } from "../db-schema";
import { metaPaginationSchema } from "./base";

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

export const goodsReceiptDetailDataSchema = t.Omit(
  baseSelectGoodsReceiptDetailSchema,
  ["goodsReceiptId"]
);

export const goodsReceiptDataSchema = t.Composite([
  baseSelectGoodsReceiptSchema,
  t.Object({
    products: t.Array(goodsReceiptDetailDataSchema),
  }),
]);

export const listGoodsReceiptDataSchema = t.Object({
  data: t.Array(baseSelectGoodsReceiptSchema),
  meta: metaPaginationSchema,
});

export const detailGoodsReceiptDataSchema = t.Object({
  data: baseSelectGoodsReceiptSchema,
});

export const createGoodsReceiptParamSchema = t.Omit(
  baseInsertGoodsReceiptSchema,
  ["id", "createdAt", "updatedAt"]
);

export const updateGoodsReceiptParamSchema = t.Omit(
  baseInsertGoodsReceiptSchema,
  ["id", "createdAt", "updatedAt"]
);

export type GoodsReceiptData = Static<typeof baseSelectGoodsReceiptSchema>;
export type GoodsReceiptListData = Static<typeof listGoodsReceiptDataSchema>;

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
  "goodsReceipt.data": goodsReceiptDataSchema,
});
