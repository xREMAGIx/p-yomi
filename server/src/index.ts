import cors from "@elysiajs/cors";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./controllers/auth.controller";
import { dashboardRoutes } from "./controllers/dashboard.controller";
import { goodsReceiptRoutes } from "./controllers/goods-receipt.controller";
import { productRoutes } from "./controllers/product.controller";
import { warehouseRoutes } from "./controllers/warehouse.controller";
import { errorPlugin } from "./libs/plugins";

const app = new Elysia({ name: "root" })
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
  .use(cors())
  .use(staticPlugin())
  .use(errorPlugin)
  .use(authRoutes)
  .use(dashboardRoutes)
  .use(productRoutes)
  .use(warehouseRoutes)
  .use(goodsReceiptRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
