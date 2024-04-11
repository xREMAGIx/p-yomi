import { Elysia } from "elysia";
import { InvalidParamError } from "../libs/error";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../libs/plugins";
import {
  getStockInWarehouseDataSchema,
  inventoryModel,
  updateInventoryConfigParamSchema,
} from "../models/inventory.model";

export const inventoryRoutes = new Elysia({
  name: "inventory",
}).group(
  `api/v1/inventory`,
  {
    detail: {
      tags: ["Inventory"],
      security: [{ JwtAuth: [] }],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(inventoryModel)
      .use(authenticatePlugin)

      //* Update config
      .put(
        "/configs",
        async ({ body, inventoryService }) => {
          await inventoryService.updateConfig({
            ...body,
          });
        },
        {
          body: updateInventoryConfigParamSchema,
          detail: {
            summary: "Update inventory configs",
          },
        }
      )
      //* Get by warehouse
      .guard((innerApp) =>
        innerApp.use(idValidatePlugin).get(
          "/warehouse/:id",
          async ({
            idParams,
            query: { sortOrder = "desc", limit = 10, page = 1 },
            inventoryService,
          }) => {
            if (sortOrder !== "asc" && sortOrder !== "desc") {
              throw new InvalidParamError("sortOrder not valid!");
            }

            return await inventoryService.getStockInWarehouse({
              warehouseId: idParams,
              sortOrder: sortOrder,
              limit: Number(limit),
              page: Number(page),
            });
          },
          {
            response: getStockInWarehouseDataSchema,
            detail: {
              summary: "Get stock in warehouse",
            },
          }
        )
      )
);
