import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productTable = pgTable("product", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  barcode: text("barcode"),
  price: integer("price").default(0).notNull(),
  expiryDate: timestamp("expiry_date"),
});

export const orderTable = pgTable("order", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  total: integer("total").default(0).notNull(),
});

export const orderDetailTable = pgTable("order_detail", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  productId: integer("product_id")
    .references(() => productTable.id)
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
});

export const warehouseTable = pgTable("warehouse", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const inventoryTable = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => productTable.id)
    .notNull(),
  warehouseId: integer("warehouse_id")
    .references(() => warehouseTable.id)
    .notNull(),
  quantityAvailable: integer("quantity_available"),
  minimumStockLevel: integer("minimum_stock_level").default(0).notNull(),
  maximumStockLevel: integer("maximum_stock_level").default(0).notNull(),
  reorderPoint: integer("reorder_point").default(0).notNull(),
});
