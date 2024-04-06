import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { customerTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectCustomerSchema = createSelectSchema(customerTable);

export const baseInsertCustomerSchema = createInsertSchema(customerTable);

export const listCustomerQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    name: t.Optional(t.String()),
    phone: t.Optional(t.String()),
  }),
]);

export const listCustomerDataSchema = t.Object({
  data: t.Array(baseSelectCustomerSchema),
  meta: metaPaginationSchema,
});

export const detailCustomerDataSchema = t.Object({
  data: baseSelectCustomerSchema,
});

export const createCustomerParamSchema = t.Omit(baseInsertCustomerSchema, [
  "id",
  "createdAt",
  "updatedAt",
]);

export const updateCustomerParamSchema = t.Omit(baseInsertCustomerSchema, [
  "id",
  "createdAt",
  "updatedAt",
]);

export type CustomerData = Static<typeof baseSelectCustomerSchema>;
export type CustomerListData = Static<typeof listCustomerDataSchema>;

export type GetListCustomerParams = Static<typeof listCustomerQuerySchema>;

export type GetDetailCustomerParams = {
  id: number;
};

export type CreateCustomerParams = Static<typeof createCustomerParamSchema>;
export type UpdateCustomerParams = Static<typeof updateCustomerParamSchema> & {
  id: number;
};

export type DeleteCustomerParams = {
  id: number;
};

//* Model
export const customerModel = new Elysia({ name: "customer-model" }).model({
  "customer.data": baseSelectCustomerSchema,
});
