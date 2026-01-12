import { pgTable, uuid, text, timestamp, numeric } from "drizzle-orm/pg-core"

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow()
})

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey(),
  clientId: uuid("client_id").notNull(),
  status: text("status").notNull(),
  totalWeight: numeric("total_weight").default("0"),
  shippingCost: numeric("shipping_cost").default("0"),
  createdAt: timestamp("created_at").defaultNow()
})

export const products = pgTable("products", {
  id: uuid("id").primaryKey(),
  orderId: uuid("order_id").notNull(),
  url: text("url").notNull(),
  price: numeric("price").notNull(),
  description: text("description")
})
