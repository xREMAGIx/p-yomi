import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const productTable = pgTable("product", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  barcode: text("barcode"),
  price: integer("price").default(0).notNull(),
});

export const orderTable = pgTable("order", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  total: integer("total").default(0).notNull(),
  paid: integer("paid").default(0).notNull(),
  customerId: integer("customer_id").references(() => customerTable.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address"),
  customerEmail: text("customer_email"),
  note: text("note"),
  status: integer("status").notNull(),
});

export const orderDetailTable = pgTable("order_detail", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  orderId: integer("order_id")
    .references(() => orderTable.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => productTable.id)
    .notNull(),
  discount: integer("discount"),
  quantity: integer("quantity").default(1).notNull(),
});

export const warehouseTable = pgTable("warehouse", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
});

export const inventoryTable = pgTable("inventory", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  productId: integer("product_id")
    .references(() => productTable.id)
    .notNull(),
  warehouseId: integer("warehouse_id")
    .references(() => warehouseTable.id)
    .notNull(),
  quantityAvailable: integer("quantity_available").default(0).notNull(),
  minimumStockLevel: integer("minimum_stock_level").default(0).notNull(),
  maximumStockLevel: integer("maximum_stock_level").default(0).notNull(),
  reorderPoint: integer("reorder_point").default(0).notNull(),
});

export const goodsReceiptTable = pgTable("goods_receipt", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  warehouseId: integer("warehouse_id")
    .references(() => warehouseTable.id)
    .notNull(),
});

export const goodsReceiptDetailTable = pgTable("goods_receipt_detail", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  goodsReceiptId: integer("goods_receipt_id")
    .references(() => goodsReceiptTable.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => productTable.id)
    .notNull(),
  quantity: integer("quantity").default(0).notNull(),
});

export const goodsIssueTable = pgTable("goods_issue", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const customerTable = pgTable("customer", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  email: text("email"),
  dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
});

export const paymentTable = pgTable("payment", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  orderId: integer("order_id")
    .references(() => orderTable.id)
    .notNull(),
  type: integer("type").notNull(),
  amount: integer("amount").default(0).notNull(),
  status: integer("status").notNull(),
});
