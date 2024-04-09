import cors from "@elysiajs/cors";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./controllers/auth.controller";
import { customerRoutes } from "./controllers/customer.controller";
import { dashboardRoutes } from "./controllers/dashboard.controller";
import { goodsReceiptRoutes } from "./controllers/goods-receipt.controller";
import { inventoryRoutes } from "./controllers/inventory.controller";
import { orderRoutes } from "./controllers/order.controller";
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
  //! Only used for testing delay
  .onBeforeHandle(async () => {
    await new Promise((r) => setTimeout(r, 300));
  })
  .use(authRoutes)
  .use(dashboardRoutes)
  .use(productRoutes)
  .use(warehouseRoutes)
  .use(goodsReceiptRoutes)
  .use(inventoryRoutes)
  .use(customerRoutes)
  .use(orderRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
