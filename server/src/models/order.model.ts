import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { orderDetailTable, orderTable } from "../db-schema";
import { metaPaginationSchema } from "./base";
import { baseSelectProductSchema } from "./product.model";
import { baseSelectWarehouseSchema } from "./warehouse.model";

export const baseSelectOrderSchema = createSelectSchema(orderTable);

export const baseInsertOrderSchema = createInsertSchema(orderTable);

export const baseSelectOrderDetailSchema = createSelectSchema(orderDetailTable);

export const baseInsertOrderDetailSchema = createInsertSchema(orderDetailTable);

export const orderProductDataSchema = t.Composite([
  t.Omit(baseSelectOrderDetailSchema, [
    "id",
    "createdAt",
    "updatedAt",
    "orderId",
    "productId",
  ]),
  baseSelectProductSchema,
]);

export const selectOrderSchema = t.Composite([
  t.Omit(baseSelectOrderSchema, ["warehouseId"]),
  t.Object({
    warehouse: t.Nullable(baseSelectWarehouseSchema),
  }),
]);

export const orderDataSchema = t.Object({
  data: baseSelectOrderSchema,
});

export const listOrderDataSchema = t.Object({
  data: t.Array(selectOrderSchema),
  meta: metaPaginationSchema,
});

export const orderDetailDataSchema = t.Composite([
  selectOrderSchema,
  t.Object({
    products: t.Array(orderProductDataSchema),
  }),
]);

export const detailOrderDataSchema = t.Object({
  data: orderDetailDataSchema,
});

export const createOrderParamSchema = t.Composite([
  t.Omit(baseInsertOrderSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({
    products: t.Array(
      t.Omit(baseInsertOrderDetailSchema, [
        "id",
        "createdAt",
        "updatedAt",
        "orderId",
      ])
    ),
  }),
]);

export const updateOrderParamSchema = t.Composite([
  t.Omit(baseInsertOrderSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({
    products: t.Array(
      t.Omit(baseInsertOrderDetailSchema, [
        "id",
        "createdAt",
        "updatedAt",
        "orderId",
      ])
    ),
  }),
]);

export type OrderData = Static<typeof selectOrderSchema>;
export type OrderListData = Static<typeof listOrderDataSchema>;
export type OrderProductData = Static<typeof orderProductDataSchema>;
export type OrderDetailData = Static<typeof orderDetailDataSchema>;

export type GetDetailOrderParams = {
  id: number;
};

export type CreateOrderParams = Static<typeof createOrderParamSchema>;

export type UpdateOrderParams = Static<typeof updateOrderParamSchema> & {
  id: number;
};

//* Model
export const orderModel = new Elysia({
  name: "order-model",
}).model({
  "order.data": detailOrderDataSchema,
});
