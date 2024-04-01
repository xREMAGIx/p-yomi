import { Elysia, t } from "elysia";
import { InvalidContentError } from "../libs/error";
import {
  authenticatePlugin,
  databasePlugin,
  idValidatePlugin,
  queryPaginationPlugin,
} from "../libs/plugins";
import {
  createWarehouseParamSchema,
  detailWarehouseDataSchema,
  listWarehouseDataSchema,
  updateWarehouseParamSchema,
  warehouseModel,
} from "../models/warehouse.model";
import WarehouseService from "../services/warehouse.service";

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
      .use(databasePlugin)
      .derive(({ db }) => {
        return {
          service: new WarehouseService(db),
        };
      })
      .use(warehouseModel)
      .use(authenticatePlugin)
      //* Create
      .post(
        "/",
        async ({ body, service }) => {
          const data = await service.create({ ...body });

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
            async ({ idParams, error, service }) => {
              const data = await service.getDetail({ id: idParams });

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
            async ({ idParams, body, service }) => {
              const data = await service.update({
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
            ({ idParams, service }) => {
              return service.delete(idParams);
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
          query: { sortBy = "desc", limit = 10, page = 1 },
          service,
        }) => {
          if (sortBy !== "asc" && sortBy !== "desc") {
            throw new InvalidContentError("Sortby not valid!");
          }

          return await service.getList({
            sortBy: sortBy,
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
