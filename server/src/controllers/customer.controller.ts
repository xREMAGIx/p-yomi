import { Elysia, t } from "elysia";
import { InvalidContentError } from "../libs/error";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../libs/plugins";
import {
  createCustomerParamSchema,
  detailCustomerDataSchema,
  listCustomerDataSchema,
  listCustomerQuerySchema,
  customerModel,
  updateCustomerParamSchema,
} from "../models/customer.model";

export const customerRoutes = new Elysia({
  name: "customer",
}).group(
  `api/v1/customer`,
  {
    detail: {
      tags: ["Customer"],
      security: [{ JwtAuth: [] }],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(customerModel)
      .use(authenticatePlugin)
      //* Create
      .post(
        "/",
        async ({ body, customerService }) => {
          const data = await customerService.create({ ...body });

          return {
            data: data,
          };
        },
        {
          body: createCustomerParamSchema,
          response: detailCustomerDataSchema,
          detail: {
            summary: "Create Customer",
          },
        }
      )

      .guard((innerApp) =>
        innerApp
          .use(idValidatePlugin)
          //* Detail
          .get(
            "/:id",
            async ({ idParams, error, customerService }) => {
              const data = await customerService.getDetail({ id: idParams });

              if (!data) {
                throw error(404, "Not Found UwU");
              }

              return {
                data,
              };
            },
            {
              response: detailCustomerDataSchema,
              detail: {
                summary: "Get Customer Detail",
              },
            }
          )
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, customerService }) => {
              const data = await customerService.update({
                ...body,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateCustomerParamSchema,
              response: detailCustomerDataSchema,
              detail: {
                summary: "Update Customer",
              },
            }
          )
          //* Delete
          .delete(
            "/:id",
            ({ idParams, customerService }) => {
              return customerService.delete(idParams);
            },
            {
              response: t.Object({
                id: t.Number(),
              }),
              detail: {
                summary: "Delete Customer",
              },
            }
          )
      )

      //* List
      .get(
        "/",
        async ({
          query: { sortBy = "desc", limit = 10, page = 1, ...rest },
          customerService,
        }) => {
          if (sortBy !== "asc" && sortBy !== "desc") {
            throw new InvalidContentError("Sortby not valid!");
          }

          return await customerService.getList({
            sortBy: sortBy,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });
        },
        {
          query: listCustomerQuerySchema,
          response: listCustomerDataSchema,
          detail: {
            summary: "Get Customer List",
          },
        }
      )
);
