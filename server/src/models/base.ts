import { Elysia, Static, t } from "elysia";

export const queryPaginationSchema = t.Partial(
  t.Object({
    sortBy: t.String(),
    sortOrder: t.Union([t.Literal("asc"), t.Literal("desc")]),
    limit: t.Numeric(),
    page: t.Numeric(),
  })
);

export const metaPaginationSchema = t.Object({
  limit: t.Number(),
  page: t.Number(),
  total: t.Number(),
  totalPages: t.Number(),
});

export type QueryPaginationParams = Static<typeof queryPaginationSchema>;

export type WithAuthenParams<T> = T & { userId: number };

//* Model
export const queryPaginationModel = new Elysia().model({
  "pagination.query": queryPaginationSchema,
  "pagination.meta": metaPaginationSchema,
});
