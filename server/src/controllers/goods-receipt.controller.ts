import { Elysia, t } from "elysia";
import { InvalidContentError } from "../libs/error";
import {
  authenticatePlugin,
  databasePlugin,
  idValidatePlugin,
  queryPaginationPlugin,
} from "../libs/plugins";
import {
  createGoodsReceiptParamSchema,
  detailGoodsReceiptDataSchema,
  goodsReceiptModel,
  listGoodsReceiptDataSchema,
  updateGoodsReceiptParamSchema,
} from "../models/goods-receipt.model";
import GoodsReceiptService from "../services/goods-receipt.service";

export const goodsReceiptRoutes = new Elysia({
  name: "goodsReceipt",
}).group(
  `api/v1/goodsReceipt`,
  {
    detail: {
      tags: ["GoodsReceipt"],
      security: [{ JwtAuth: [] }],
    },
  },
  (app) =>
    app
      .use(databasePlugin)
      .derive(({ db }) => {
        return {
          service: new GoodsReceiptService(db),
        };
      })
      .use(goodsReceiptModel)
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
          body: createGoodsReceiptParamSchema,
          response: detailGoodsReceiptDataSchema,
          detail: {
            summary: "Create GoodsReceipt",
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
              response: detailGoodsReceiptDataSchema,
              detail: {
                summary: "Get GoodsReceipt Detail",
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
              body: updateGoodsReceiptParamSchema,
              response: detailGoodsReceiptDataSchema,
              detail: {
                summary: "Update GoodsReceipt",
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
                summary: "Delete GoodsReceipt",
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
          response: listGoodsReceiptDataSchema,
          detail: {
            summary: "Get GoodsReceipt List",
          },
        }
      )
);
