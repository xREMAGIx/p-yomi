import { Elysia, t } from "elysia";
import { InvalidContentError } from "../libs/error";
import {
  authenticatePlugin,
  databasePlugin,
  idValidatePlugin,
  queryPaginationPlugin,
} from "../libs/plugins";
import {
  createProductParamSchema,
  detailProductDataSchema,
  listProductDataSchema,
  productModel,
  updateProductParamSchema,
} from "../models/product.model";
import ProductService from "../services/product.service";

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
      .use(databasePlugin)
      .derive(({ db }) => {
        return {
          service: new ProductService(db),
        };
      })
      .use(productModel)
      .use(authenticatePlugin)
      //* Create
      .post(
        "/",
        async ({ body, userId, service }) => {
          const data = await service.create({ ...body });

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
              response: detailProductDataSchema,
              detail: {
                summary: "Get Product Detail",
              },
            }
          )
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, service }) => {
              const data = await service.update({
                id: idParams,
                ...body,
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
                summary: "Delete Product",
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
          response: listProductDataSchema,
          detail: {
            summary: "Get Product List",
          },
        }
      )
);
