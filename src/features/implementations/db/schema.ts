import { OrderStatus } from "@/features/models/OrderModel";
import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgPolicy,
  integer,
} from "drizzle-orm/pg-core";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    clientId: uuid("client_id").notNull(),

    status: text("status")
      .$type<OrderStatus>()
      .notNull()
      .default("pending_review"),

    packageCost: integer("package_cost").notNull().default(0),

    shippingCost: integer("shipping_cost").notNull().default(0),

    investedAmount: integer("invested_amount").notNull().default(0),

    paidAmount: integer("paid_amount").notNull().default(0),

    shopCartUrl: text("shop_cart_url").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    pgPolicy("admin_full_access", {
      for: "all",
      to: "authenticated",
      using: sql`public.is_admin()`,
      withCheck: sql`public.is_admin()`,
    }),

    pgPolicy("user_view_own_orders", {
      for: "select",
      to: "authenticated",
      using: sql`public.get_my_id() = ${table.clientId}`,
    }),

    pgPolicy("user_create_own_orders", {
      for: "insert",
      to: "authenticated",
      withCheck: sql`public.get_my_id() = ${table.clientId}`,
    }),
  ]
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    storeOrderId: text("store_order_id").notNull(),

    url: text("url").notNull(),

    name: text("name").notNull(),

    trackingNumber: text("tracking_number").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    pgPolicy("admin_full_access", {
      for: "all",
      to: "authenticated",
      using: sql`public.is_admin()`,
      withCheck: sql`public.is_admin()`,
    }),

    pgPolicy("user_view_order_products", {
      for: "select",
      to: "authenticated",
      using: sql`exists (
        select 1 from ${orders} 
        where ${orders.id} = ${table.orderId} 
        and ${orders.clientId} = public.get_my_id()
      )`,
    }),
  ]
);

export const ordersRelations = relations(orders, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  order: one(orders, {
    fields: [products.orderId],
    references: [orders.id],
  }),
}));
