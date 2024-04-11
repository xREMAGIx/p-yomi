import { Elysia, t } from "elysia";
import { InvalidContentError } from "../libs/error";
import {
  authenticatePlugin,
  idValidatePlugin,
  queryPaginationPlugin,
  servicesPlugin,
} from "../libs/plugins";
import {
  createWarehouseParamSchema,
  detailWarehouseDataSchema,
  listWarehouseDataSchema,
  updateWarehouseParamSchema,
  warehouseModel,
} from "../models/warehouse.model";

export const warehouseRoutes = new Elysia({
  name: "warehouse",
}).group(
  `api/v1/warehouse`,
  {
    detail: {
      tags: ["Warehouse"],
      security: [{ JwtAuth: [] }],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(warehouseModel)
      .use(authenticatePlugin)
      //* Create
      .post(
        "/",
        async ({ body, warehouseService }) => {
          const data = await warehouseService.create({ ...body });

          return {
            data: data,
          };
        },
        {
          body: createWarehouseParamSchema,
          response: detailWarehouseDataSchema,
          detail: {
            summary: "Create Warehouse",
          },
        }
      )

      .guard((innerApp) =>
        innerApp
          .use(idValidatePlugin)
          //* Detail
          .get(
            "/:id",
            async ({ idParams, error, warehouseService }) => {
              const data = await warehouseService.getDetail({ id: idParams });

              if (!data) {
                throw error(404, "Not Found UwU");
              }

              return {
                data,
              };
            },
            {
              response: detailWarehouseDataSchema,
              detail: {
                summary: "Get Warehouse Detail",
              },
            }
          )
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, warehouseService }) => {
              const data = await warehouseService.update({
                ...body,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateWarehouseParamSchema,
              response: detailWarehouseDataSchema,
              detail: {
                summary: "Update Warehouse",
              },
            }
          )
          //* Delete
          .delete(
            "/:id",
            ({ idParams, warehouseService }) => {
              return warehouseService.delete(idParams);
            },
            {
              response: t.Object({
                id: t.Number(),
              }),
              detail: {
                summary: "Delete Warehouse",
              },
            }
          )

          //* Query products
          .delete(
            "/:id/product",
            ({ idParams, warehouseService }) => {
              return warehouseService.delete(idParams);
            },
            {
              response: t.Object({
                id: t.Number(),
              }),
              detail: {
                summary: "Delete Warehouse",
              },
            }
          )
      )

      //* List
      .use(queryPaginationPlugin)
      .get(
        "/",
        async ({
          query: { sortOrder = "desc", limit = 10, page = 1 },
          warehouseService,
        }) => {
          if (sortOrder !== "asc" && sortOrder !== "desc") {
            throw new InvalidContentError("sortOrder not valid!");
          }

          return await warehouseService.getList({
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
          });
        },
        {
          response: listWarehouseDataSchema,
          detail: {
            summary: "Get Warehouse List",
          },
        }
      )
);
