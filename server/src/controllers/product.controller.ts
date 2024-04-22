import { Elysia, t } from "elysia";
import { InvalidContentError } from "../libs/error";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../libs/plugins";
import {
  ProductData,
  createProductParamSchema,
  detailProductDataSchema,
  detailProductWithInventoryDataSchema,
  listProductDataSchema,
  listProductQuerySchema,
  listProductWithInventoryDataSchema,
  productModel,
  updateProductParamSchema,
} from "../models/product.model";

export const productRoutes = new Elysia({
  name: "product",
}).group(
  `api/v1/product`,
  {
    detail: {
      tags: ["Product"],
      security: [{ JwtAuth: [] }],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(productModel)
      .use(authenticatePlugin)
      //* Create
      .post(
        "/",
        async ({ body, userId, productService }) => {
          const data = await productService.create({ ...body, userId });

          return {
            data: data,
          };
        },
        {
          body: createProductParamSchema,
          response: detailProductDataSchema,
          detail: {
            summary: "Create Product",
          },
          // transform: ({ body }) => {
          //   if (body.expiryDate) {
          //     body.expiryDate = new Date(body.expiryDate);
          //   }
          // },
        }
      )

      .guard((innerApp) =>
        innerApp
          .use(idValidatePlugin)
          //* Detail
          .get(
            "/:id",
            async ({ idParams, error, productService }) => {
              const data = await productService.getDetail({ id: idParams });

              if (!data) {
                throw error(404, "Not Found UwU");
              }

              return {
                data,
              };
            },
            {
              response: detailProductDataSchema,
              detail: {
                summary: "Get Product Detail",
              },
            }
          )
          //* Detail
          .get(
            "/:id/with-inventory",
            async ({ idParams, error, productService }) => {
              const data = await productService.getDetailWithInventory({
                id: idParams,
              });

              if (!data) {
                throw error(404, "Not Found UwU");
              }

              return {
                data,
              };
            },
            {
              response: detailProductWithInventoryDataSchema,
              detail: {
                summary: "Get Product Detail with Inventory",
              },
            }
          )
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, userId, productService }) => {
              const data = await productService.update({
                ...body,
                userId,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateProductParamSchema,
              response: detailProductDataSchema,
              detail: {
                summary: "Update Product",
              },
              // transform: ({ body }) => {
              //   if (body.expiryDate) {
              //     body.expiryDate = new Date(body.expiryDate);
              //   }
              // },
            }
          )
          //* Delete
          .delete(
            "/:id",
            ({ idParams, productService }) => {
              return productService.delete(idParams);
            },
            {
              response: t.Object({
                id: t.Number(),
              }),
              detail: {
                summary: "Delete Product",
              },
            }
          )
      )

      //* List
      .get(
        "/",
        async ({
          query: {
            sortBy: sortByParams,
            sortOrder = "desc",
            limit = 10,
            page = 1,
            ...rest
          },
          productService,
        }) => {
          const sortBy = sortByParams as keyof ProductData;
          const sortByList: (keyof ProductData)[] = [
            "name",
            "price",
            "createdAt",
            "updatedAt",
          ];
          if (sortBy && !sortByList.includes(sortBy)) {
            throw new InvalidContentError("sortBy not valid!");
          }

          if (sortOrder !== "asc" && sortOrder !== "desc") {
            throw new InvalidContentError("sortOrder not valid!");
          }

          return await productService.getList({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });
        },
        {
          query: listProductQuerySchema,
          response: listProductDataSchema,
          detail: {
            summary: "Get Product List",
          },
        }
      )

      .get(
        "/with-inventory",
        async ({
          query: { sortOrder = "desc", limit = 10, page = 1, ...rest },
          productService,
        }) => {
          if (sortOrder !== "asc" && sortOrder !== "desc") {
            throw new InvalidContentError("sortOrder not valid!");
          }

          return await productService.getListWithInventory({
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });
        },
        {
          query: listProductQuerySchema,
          response: listProductWithInventoryDataSchema,
          detail: {
            summary: "Get Product List with Inventory",
          },
        }
      )
);
