"use server"

import { db } from "@/lib/db"
import { orders, products } from "@/lib/db/schema"
import { supabaseAdmin } from "@/lib/supabase/server"
import { eq, and, ilike } from "drizzle-orm"

export async function createOrder(
  items: {
    url: string
    price: string
    description?: string
  }[]
) {
  
  const { data } = await supabaseAdmin.auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  const orderId = crypto.randomUUID()

  await db.transaction(async (tx) => {
    await tx.insert(orders).values({
      id: orderId,
      clientId: data.user.id,
      status: "revision pendiente"
    })

    for (const item of items) {
      await tx.insert(products).values({
        id: crypto.randomUUID(),
        orderId,
        ...item
      })
    }
  })

  return { success: true }
}

export async function updateOrderStatus(
  orderId: string,
  status: string
) {
  await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId))
}

export async function deleteOrder(orderId: string) {
  await db.delete(orders).where(eq(orders.id, orderId))
}

export async function getMyOrders() {
  
  const { data } = await supabaseAdmin.auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  return db.query.orders.findMany({
    where: eq(orders.clientId, data.user.id),
    with: {
      products: true
    }
  })
}

export async function getAllOrders() {
  return db.query.orders.findMany({
    with: {
      products: true
    }
  })
}

export async function filterOrders({
  status,
  productText
}: {
  status?: string
  productText?: string
}) {
  return db
    .select()
    .from(orders)
    .leftJoin(products, eq(products.orderId, orders.id))
    .where(
      and(
        status ? eq(orders.status, status) : undefined,
        productText
          ? ilike(products.description, `%${productText}%`)
          : undefined
      )
    )
}
