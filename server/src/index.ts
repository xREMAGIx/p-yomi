import cors from "@elysiajs/cors";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./controllers/auth.controller";
import { productRoutes } from "./controllers/product.controller";
import { warehouseRoutes } from "./controllers/warehouse.controller";
import { errorPlugin } from "./libs/plugins";
import { goodsReceiptRoutes } from "./controllers/goods-receipt.controller";

const app = new Elysia({ name: "root" })
  .use(cors())
  .use(
    swagger({
      path: "/documentation",
      documentation: {
        components: {
          securitySchemes: {
            JwtAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Enter JWT Bearer token **_only_**",
            },
          },
        },
      },
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )
  .use(staticPlugin())
  .use(errorPlugin)
  .use(authRoutes)
  .use(productRoutes)
  .use(warehouseRoutes)
  .use(goodsReceiptRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
