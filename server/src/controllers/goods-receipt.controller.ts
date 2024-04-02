import { Elysia, t } from "elysia";
import { InvalidContentError } from "../libs/error";
import {
  authenticatePlugin,
  idValidatePlugin,
  queryPaginationPlugin,
  servicesPlugin,
} from "../libs/plugins";
import {
  createGoodsReceiptParamSchema,
  detailGoodsReceiptDataSchema,
  goodsReceiptDataSchema,
  goodsReceiptModel,
  listGoodsReceiptDataSchema,
  updateGoodsReceiptParamSchema,
} from "../models/goods-receipt.model";

export const goodsReceiptRoutes = new Elysia({
  name: "goodsReceipt",
}).group(
  `api/v1/goods-receipt`,
  {
    detail: {
      tags: ["Goods Receipt"],
      security: [{ JwtAuth: [] }],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(goodsReceiptModel)
      .use(authenticatePlugin)
      //* Create
      .post(
        "/",
        async ({ body, goodsReceiptService, inventoryService }) => {
          const data = await goodsReceiptService.create({ ...body });
          await inventoryService.updateStock({ ...body });

          return {
            data: data,
          };
        },
        {
          body: createGoodsReceiptParamSchema,
          response: goodsReceiptDataSchema,
          detail: {
            summary: "Create Goods Receipt",
          },
        }
      )

      .guard((innerApp) =>
        innerApp
          .use(idValidatePlugin)
          //* Detail
          .get(
            "/:id",
            async ({ idParams, error, goodsReceiptService }) => {
              const { goodsReceipt } = await goodsReceiptService.getDetail({
                id: idParams,
              });

              if (!goodsReceipt) {
                throw error(404, "Not Found UwU");
              }

              return {
                data: goodsReceipt,
              };
            },
            {
              response: detailGoodsReceiptDataSchema,
              detail: {
                summary: "Get Goods Receipt Detail",
              },
            }
          )
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, goodsReceiptService }) => {
              const data = await goodsReceiptService.update({
                ...body,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateGoodsReceiptParamSchema,
              response: goodsReceiptDataSchema,
              detail: {
                summary: "Update Goods Receipt",
              },
            }
          )
          //* Delete
          .delete(
            "/:id",
            ({ idParams, goodsReceiptService }) => {
              return goodsReceiptService.delete(idParams);
            },
            {
              response: t.Object({
                id: t.Number(),
              }),
              detail: {
                summary: "Delete Goods Receipt",
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
          goodsReceiptService,
        }) => {
          if (sortBy !== "asc" && sortBy !== "desc") {
            throw new InvalidContentError("Sortby not valid!");
          }

          return await goodsReceiptService.getList({
            sortBy: sortBy,
            limit: Number(limit),
            page: Number(page),
          });
        },
        {
          response: listGoodsReceiptDataSchema,
          detail: {
            summary: "Get Goods Receipt List",
          },
        }
      )
);
