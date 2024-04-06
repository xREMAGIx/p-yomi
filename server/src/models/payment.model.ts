import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { paymentTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectPaymentSchema = createSelectSchema(paymentTable);

export const baseInsertPaymentSchema = createInsertSchema(paymentTable);

export const listPaymentQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    barcode: t.Optional(t.String()),
    name: t.Optional(t.String()),
  }),
]);

export const listPaymentDataSchema = t.Object({
  data: t.Array(baseSelectPaymentSchema),
  meta: metaPaginationSchema,
});

export const detailPaymentDataSchema = t.Object({
  data: baseSelectPaymentSchema,
});

export const createPaymentParamSchema = t.Omit(baseInsertPaymentSchema, [
  "id",
  "createdAt",
  "updatedAt",
]);

export const updatePaymentParamSchema = t.Omit(baseInsertPaymentSchema, [
  "id",
  "createdAt",
  "updatedAt",
]);

export type PaymentData = Static<typeof baseSelectPaymentSchema>;
export type PaymentListData = Static<typeof listPaymentDataSchema>;

export type GetListPaymentParams = Static<typeof listPaymentQuerySchema>;

export type GetDetailPaymentParams = {
  id: number;
};

export type CreatePaymentParams = Static<typeof createPaymentParamSchema>;
export type UpdatePaymentParams = Static<typeof updatePaymentParamSchema> & {
  id: number;
};

//* Model
export const paymentModel = new Elysia({ name: "payment-model" }).model({
  "payment.data": baseSelectPaymentSchema,
});
