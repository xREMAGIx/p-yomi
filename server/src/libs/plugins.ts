import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { db } from "../config/database";
import { queryPaginationModel } from "../models/base";
import AuthService from "../services/auth.service";
import GoodsReceiptService from "../services/goods-receipt.service";
import InventoryService from "../services/inventory.service";
import ProductService from "../services/product.service";
import WarehouseService from "../services/warehouse.service";
import * as CustomError from "./error";
import CustomerService from "../services/customer.service";

export const tokenPlugin = new Elysia({ name: "token-plugin" })
  .use(
    jwt({
      name: "accessJwt",
      secret: process.env.JWT_SECRET ?? "iamasecret",
      exp: process.env.JWT_ACCESS_EXPIRATION ?? "1h",
    })
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: process.env.JWT_SECRET ?? "iamasecret",
      exp: process.env.JWT_REFRESH_EXPIRATION ?? "30d",
    })
  );

export const authenticatePlugin = new Elysia({ name: "authenticate-plugin" })
  .use(tokenPlugin)
  .use(bearer())
  .onBeforeHandle({ as: "global" }, ({ bearer }) => {
    if (!bearer) {
      throw new CustomError.UnauthorizedError("Unauthorized!");
    }
  })
  .resolve({ as: "global" }, async ({ bearer, accessJwt }) => {
    const data = await accessJwt.verify(bearer);

    if (!data) {
      throw new CustomError.UnauthorizedError("Invalid token!");
    }

    if (!data["sub"]) {
      throw new CustomError.UnauthorizedError("Invalid authorized data!");
    }

    return {
      userId: Number(data["sub"]),
    };
  });

export const errorPlugin = new Elysia({ name: "error-plugin" })
  .error({
    ...CustomError,
  })
  .onError({ as: "scoped" }, ({ code, error, set }) => {
    switch (code) {
      case "UnauthorizedError":
      case "InvalidParamError":
      case "InvalidContentError":
      case "NotfoundDataError":
        set.status = error.statusCode;

        return {
          code: error.statusCode,
          message: error.message,
        };

      case "INTERNAL_SERVER_ERROR":
      default:
        console.log(error.message);
        set.status = 500;

        return {
          code: 500,
          message: "Internal Server",
        };
    }
  });

export const queryPaginationPlugin = new Elysia({ name: "query-pagination" })
  .use(queryPaginationModel)
  .guard({
    query: "pagination.query",
  });

export const idValidatePlugin = new Elysia({
  name: "id-validate",
})
  .guard({
    params: t.Object({
      id: t.Numeric({
        error: "Invalid id UwU",
      }),
    }),
  })
  .derive({ as: "scoped" }, ({ params }) => ({
    idParams: params.id,
  }))
  .onBeforeHandle({ as: "scoped" }, ({ params }) => {
    const { id } = params;
    if (!id || +id < 1) {
      throw new CustomError.InvalidParamError("Invalid id");
    }
  });

export const databasePlugin = new Elysia({ name: "connect-db" }).decorate(
  "db",
  db
);

export const servicesPlugin = new Elysia({ name: "services-plugin" })
  .use(databasePlugin)
  .derive({ as: "scoped" }, ({ db }) => {
    return {
      authService: new AuthService(db),
      productService: new ProductService(db),
      warehouseService: new WarehouseService(db),
      inventoryService: new InventoryService(db),
      goodsReceiptService: new GoodsReceiptService(db),
      customerService: new CustomerService(db),
    };
  });
