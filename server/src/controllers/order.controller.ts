import { Elysia, t } from "elysia";
import { InvalidContentError } from "../libs/error";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../libs/plugins";
import {
  createOrderParamSchema,
  orderDataSchema,
  orderModel,
} from "../models/order.model";
import { PaymentStatusCode } from "../models/payment.model";

export const orderRoutes = new Elysia({
  name: "order",
}).group(
  `api/v1/order`,
  {
    detail: {
      tags: ["Order"],
      security: [{ JwtAuth: [] }],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(orderModel)
      .use(authenticatePlugin)
      //* Create
      .post(
        "/",
        async ({ body, orderService, inventoryService, paymentService }) => {
          const { products, warehouseId, payment, ...orderParams } = body;
          const data = await orderService.create({
            ...orderParams,
            payment,
            products,
            warehouseId,
          });
          await paymentService.create({
            orderId: data.id,
            amount: orderParams.paid,
            type: payment.type,
            note: payment.note,
            status: PaymentStatusCode.PAID,
          });
          await inventoryService.useStock({ warehouseId, products });

          return {
            data: data,
          };
        },
        {
          body: createOrderParamSchema,
          response: orderDataSchema,
          detail: {
            summary: "Create Order",
          },
        }
      )

      .guard((innerApp) =>
        innerApp
          .use(idValidatePlugin)
          // //* Detail
          // .get(
          //   "/:id",
          //   async ({ idParams, error, orderService }) => {
          //     const { order } = await orderService.getDetail({
          //       id: idParams,
          //     });

          //     if (!order) {
          //       throw error(404, "Not Found UwU");
          //     }

          //     return {
          //       data: order,
          //     };
          //   },
          //   {
          //     response: detailOrderDataSchema,
          //     detail: {
          //       summary: "Get Order Detail",
          //     },
          //   }
          // )
          // //* Update
          // .put(
          //   "/:id",
          //   async ({ idParams, body, orderService, inventoryService }) => {
          //     const { warehouseId, modifiedProducts } =
          //       await orderService.update({
          //         ...body,
          //         id: idParams,
          //       });
          //     await inventoryService.updateStock({
          //       warehouseId: warehouseId,
          //       products: modifiedProducts,
          //     });

          //     return { id: idParams };
          //   },
          //   {
          //     body: updateOrderParamSchema,
          //     response: t.Object({
          //       id: t.Numeric(),
          //     }),
          //     detail: {
          //       summary: "Update Order",
          //     },
          //   }
          // )
          //* Delete
          .delete(
            "/:id",
            async ({ idParams, orderService, inventoryService }) => {
              const { id } = await orderService.delete(idParams);

              return { id: idParams };
            },
            {
              response: t.Object({
                id: t.Numeric(),
              }),
              detail: {
                summary: "Delete Order",
              },
            }
          )
      )

      //* List
      .get(
        "/",
        async ({
          query: { sortOrder = "desc", limit = 10, page = 1 },
          orderService,
        }) => {
          if (sortOrder !== "asc" && sortOrder !== "desc") {
            throw new InvalidContentError("sortOrder not valid!");
          }

          return await orderService.getList({
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
          });
        },
        {
          //   response: listOrderDataSchema,
          detail: {
            summary: "Get Order List",
          },
        }
      )
);
