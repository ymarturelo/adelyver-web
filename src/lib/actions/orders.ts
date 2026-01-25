"use server"

import { db } from "@/lib/db"
import { orders, products, profiles } from "@/lib/db/schema"
import { supabase } from "@/lib/supabase/server"
import { eq, and, ilike } from "drizzle-orm"

interface CreateOrderInput {
  items: {
    storeOrderId: string
    url: string
    name: string
    trackingNumber?: string
  }[]
}

export async function createOrder(input: CreateOrderInput) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  const orderId = crypto.randomUUID()

  await db.transaction(async (tx) => {
    await tx.insert(orders).values({
      id: orderId,
      clientId: data.user!.id,
      status: "revision pendiente",
    })

    for (const item of input.items) {
      await tx.insert(products).values({
        id: crypto.randomUUID(),
        orderId,
        storeOrderId: item.storeOrderId,
        url: item.url,
        name: item.name,
        trackingNumber: item.trackingNumber || null,
      })
    }
  })

  return { id: orderId }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  await db.update(orders).set({ status }).where(eq(orders.id, orderId))

  return { success: true }
}

export async function deleteOrder(orderId: string) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  await db.delete(orders).where(eq(orders.id, orderId))

  return { success: true }
}

export async function getMyOrders() {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  return db.query.orders.findMany({
    where: eq(orders.clientId, data.user.id),
    with: {
      products: true,
    },
  })
}

export async function getOrderById(orderId: string) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  return db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      products: true,
    },
  })
}

export async function getAllOrders() {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  return db.query.orders.findMany({
    with: {
      products: true,
    },
  })
}

interface FilterOrdersInput {
  trackingNumber?: string
  productId?: string
  clientId?: string
  clientFullName?: string
}

export async function filterOrders(input: FilterOrdersInput) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

 
  if (!input.trackingNumber && !input.productId && !input.clientId && !input.clientFullName) {
    return db.query.orders.findMany({
      with: {
        products: true,
      },
    })
  }

  
  const allOrders = await db.query.orders.findMany({
    with: {
      products: true,
    },
  })

  
  const filteredOrders = allOrders.filter((order: any) => {
    const orderProducts = (order.products as any[]) || []

   
    if (input.trackingNumber) {
      const hasTrackingNumber = orderProducts.some(
        (p: any) => p.trackingNumber === input.trackingNumber
      )
      if (!hasTrackingNumber) return false
    }

    
    if (input.productId) {
      const hasProductId = orderProducts.some((p: any) => p.id === input.productId)
      if (!hasProductId) return false
    }

   
    if (input.clientId && order.clientId !== input.clientId) {
      return false
    }

    return true
  })

  
  if (input.clientFullName) {
    
    const client = await db.query.profiles.findFirst({
      where: ilike(profiles.fullName, `%${input.clientFullName}%`) as any,
    })

    if (!client) return []

    return filteredOrders.filter((order) => order.clientId === client.id)
  }

  return filteredOrders
}

export async function updateOrderCosts(
  orderId: string,
  costs: {
    packageCost?: string
    shippingCost?: string
    investedAmount?: string
    paidAmount?: string
  }
) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  const updateData: Record<string, any> = {}

  if (costs.packageCost !== undefined) updateData.packageCost = costs.packageCost
  if (costs.shippingCost !== undefined)
    updateData.shippingCost = costs.shippingCost
  if (costs.investedAmount !== undefined)
    updateData.investedAmount = costs.investedAmount
  if (costs.paidAmount !== undefined) updateData.paidAmount = costs.paidAmount

  if (Object.keys(updateData).length === 0) {
    return { success: true }
  }

  await db.update(orders).set(updateData).where(eq(orders.id, orderId))

  return { success: true }
}
