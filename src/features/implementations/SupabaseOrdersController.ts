import { eq, sql, desc, exists, and, ilike } from "drizzle-orm";
import IOrdersController, {
  FindOrdersRequest,
  CreateOrderByClientRequest,
  CreateOrderByAdminRequest,
  UpdateOrderByAdminRequest,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateOrderByClientRequest,
  OrderDto,
  ClientOrderDto,
} from "../abstractions/IOrderController";
import { Result } from "../shared/Result";
import { randomUUID } from "node:crypto";
import { orders, products, userSearch } from "./db/schema";
import { db, TransactionType } from "./db";
import { supabaseAdmin } from "@/lib/supabase/server";

export const createSupabaseOrdersController = (
  tx: TransactionType
): IOrdersController => {
  return {
    getClientOrderById: async (orderId: string) => {
      const data = await tx.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: {
          products: {
            columns: {
              name: true,
            },
          },
        },
      });

      if (!data)
        return Result.err({
          code: "NOT_FOUND",
          message: "Pedido no encontrado",
        });

      const supabase = supabaseAdmin();
      const client = await supabase.auth.admin.getUserById(data.clientId);

      return Result.ok({
        id: data.id,
        clientId: data.clientId,
        status: data.status,
        packagePrice: data.packageCost,
        deliveryPrice: data.shippingCost,
        spentMoney: data.investedAmount,
        moneyPaidByClient: data.paidAmount,
        shopCartUrl: data.shopCartUrl,
        createdBy:
          client.data.user?.user_metadata?.full_name ?? "UNKNOWN_CLIENT",
        productSummary: data.products.map((p) => p.name).join(", "),
        createdAt: data.createdAt,
        updatedAt: data.createdAt,
      });
    },

    getClientAllOrders: async () => {
      const data = await tx.query.orders.findMany({
        orderBy: orders.updatedAt,
        with: {
          products: {
            columns: {
              name: true,
            },
          },
        },
      });

      const supabase = supabaseAdmin();
      const clients: string[] = [];
      for (const d of data) {
        const user = await supabase.auth.admin.getUserById(d.clientId);
        const name =
          user.data.user?.user_metadata?.full_name ?? "UNKNOWN_CLIENT";
        clients.push(name);
      }

      return Result.ok(
        data.map(
          (d, index) =>
            ({
              id: d.id,
              clientId: d.clientId,
              status: d.status,
              packagePrice: d.packageCost,
              deliveryPrice: d.shippingCost,
              moneyPaidByClient: d.paidAmount,
              shopCartUrl: d.shopCartUrl,
              createdBy: clients[index],
              productSummary: d.products.map((p) => p.name).join(", "),
              createdAt: d.createdAt,
              updatedAt: d.createdAt,
            } satisfies ClientOrderDto)
        )
      );
    },

    getClientOrderProducts: async (orderId: string) => {
      const data = await tx.query.products.findMany({
        where: eq(products.orderId, orderId),
      });

      return Result.ok(
        data.map((p) => ({
          id: p.id,
          orderId: p.orderId,
          idFromShop: p.storeProductId,
          name: p.name,
          url: p.url,
          trackingNumber: p.trackingNumber,
          createdAt: p.createdAt,
          updatedAt: p.createdAt,
        }))
      );
    },

    findOrders: async (req: FindOrdersRequest) => {
      const query = tx.query.orders.findMany({
        with: {
          products: {
            columns: {
              name: true,
            },
          },
        },
        where: () => {
          const conditions = [];

          if (req.trackingNumber) {
            conditions.push(
              exists(
                tx
                  .select()
                  .from(products)
                  .where(
                    and(
                      eq(products.orderId, orders.id),
                      ilike(products.trackingNumber, `%${req.trackingNumber}%`)
                    )
                  )
              )
            );
          }

          if (req.storeProductId) {
            conditions.push(
              exists(
                tx
                  .select()
                  .from(products)
                  .where(
                    and(
                      eq(products.orderId, orders.id),
                      ilike(products.storeProductId, `%${req.storeProductId}%`)
                    )
                  )
              )
            );
          }

          if (req.clientNumber) {
            conditions.push(
              exists(
                db
                  .select()
                  .from(userSearch)
                  .where(
                    and(
                      eq(userSearch.id, orders.clientId),
                      ilike(userSearch.phone, `%${req.clientNumber}%`)
                    )
                  )
              )
            );
          }

          if (req.clientName) {
            conditions.push(
              exists(
                db
                  .select({ id: userSearch.id })
                  .from(userSearch)
                  .where(
                    and(
                      eq(userSearch.id, orders.clientId),
                      ilike(userSearch.fullName, `%${req.clientName}%`)
                    )
                  )
              )
            );
          }

          // if (req.createdAfter) {
          //   conditions.push(gte(row.createdAt, req.createdAfter));
          // }
          // if (req.createdBefore) {
          //   conditions.push(lte(row.createdAt, req.createdBefore));
          // }

          // if (req.ignoreCancelled) conditions.push(ne(row.status, "cancelled"));
          // if (req.ignoreDelievered)
          //   conditions.push(ne(row.status, "delivered"));

          return and(...conditions);
        },
        orderBy: desc(orders.updatedAt),
      });

      const data = await query;
      const supabase = supabaseAdmin();
      const clients: string[] = [];
      for (const d of data) {
        const user = await supabase.auth.admin.getUserById(d.clientId);
        const name =
          user.data.user?.user_metadata?.full_name ?? "UNKNOWN_CLIENT";
        clients.push(name);
      }

      return Result.ok(
        data.map(
          (i, index) =>
            ({
              id: i.id,
              clientId: i.clientId,
              status: i.status,
              packagePrice: i.packageCost,
              deliveryPrice: i.shippingCost,
              spentMoney: i.investedAmount,
              moneyPaidByClient: i.paidAmount,
              createdAt: i.createdAt,
              updatedAt: i.createdAt,
              shopCartUrl: i.shopCartUrl,
              createdBy: clients[index],
              productSummary: i.products.map((p) => p.name).join(", "),
            } satisfies OrderDto)
        )
      );
    },

    createOrderByClient: async (req: CreateOrderByClientRequest) => {
      await tx.insert(orders).values({
        id: randomUUID(),
        status: "pending_review",
        clientId: sql`(current_setting('request.jwt.claims', true)::jsonb ->> 'sub')::uuid`,
        shopCartUrl: req.shopCartUrl,
      });
      return Result.ok(undefined);
    },

    createOrderByAdmin: async (req: CreateOrderByAdminRequest) => {
      const id = randomUUID();
      await tx.insert(orders).values({
        id,
        clientId: req.clientId,
        status: req.status,
        packageCost: req.packagePrice ?? 0,
        shippingCost: req.deliveryPrice ?? 0,
        shopCartUrl: "//created-by-admin//",
      });
      return Result.ok({ id });
    },

    updateOrderByClient: async (req: UpdateOrderByClientRequest) => {
      const data = await tx.query.orders.findFirst({
        where: eq(orders.id, req.orderId),
      });

      if (!data)
        return Result.err({
          code: "NOT_FOUND",
          message: "Pedido no encontrado",
        });

      if (data.status !== "pending_review")
        return Result.err({
          code: "UNAUTHORIZED",
          message: "No tienes permisos",
        });

      await tx
        .update(orders)
        .set({
          shopCartUrl: req.shopCartUrl,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, req.orderId));

      return Result.ok(undefined);
    },

    updateOrderByAdmin: async (req: UpdateOrderByAdminRequest) => {
      await tx
        .update(orders)
        .set({
          status: req.status,
          packageCost: req.packagePrice,
          shippingCost: req.deliveryPrice,
          investedAmount: req.spentMoney,
          paidAmount: req.moneyPaidByClient,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, req.orderId));

      return Result.ok(undefined);
    },

    createProductByAdmin: async (req: CreateProductRequest) => {
      await tx.insert(products).values({
        id: randomUUID(),
        orderId: req.orderId,
        storeProductId: req.idFromShop,
        url: req.url,
        name: req.name,
        trackingNumber: req.trackingNumber ?? "",
      });
      return Result.ok(undefined);
    },

    updateProductByAdmin: async (req: UpdateProductRequest) => {
      await tx
        .update(products)
        .set({
          trackingNumber: req.trackingNumber,
          name: req.name,
          storeProductId: req.idFromShop,
          url: req.url,
          updatedAt: new Date(),
        })
        .where(eq(products.id, req.id));
      return Result.ok(undefined);
    },

    deleteProductByAdmin: async (id: string) => {
      await tx.delete(products).where(eq(products.id, id));
      return Result.ok(undefined);
    },
  };
};
