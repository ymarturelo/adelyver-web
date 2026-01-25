import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";



export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey(),
     
    fullName: text("full_name").notNull(),
    email: text("email"),
    phone: text("phone"),

    role: text("role").notNull().default("user"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    emailOrPhoneRequired: sql`
      CHECK (
        ${table.email} IS NOT NULL
        OR ${table.phone} IS NOT NULL
      )
    `,
  })
);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),

  clientId: uuid("client_id")
    .notNull()
    .references(() => profiles.id, {
      onDelete: "cascade",
    }),

  status: text("status").notNull(),

  packageCost: numeric("package_cost", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),

  shippingCost: numeric("shipping_cost", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),

  investedAmount: numeric("invested_amount", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),

  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});



export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),

  storeOrderId: text("store_order_id").notNull(),

  url: text("url").notNull(),

  name: text("name").notNull(),

  trackingNumber: text("tracking_number"),
});

