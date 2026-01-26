"use server"

import { db } from "@/lib/db"
import { orders, products, profiles } from "@/lib/db/schema"
import { supabase } from "@/lib/supabase/server"
import { eq, and, ilike } from "drizzle-orm"
import { successResponse, errorResponse, handleActionError, type ApiResponse } from "./response"

interface CreateOrderInput {
  items: {
    storeOrderId: string
    url: string
    name: string
    trackingNumber?: string
  }[]
}

export async function createOrder(input: CreateOrderInput): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

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

    return successResponse({ id: orderId }, 201, "Orden creada exitosamente")
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    await db.update(orders).set({ status }).where(eq(orders.id, orderId))

    return successResponse({ success: true }, 200, "Estado de la orden actualizado")
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteOrder(orderId: string): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    await db.delete(orders).where(eq(orders.id, orderId))

    return successResponse({ success: true }, 200, "Orden eliminada exitosamente")
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getMyOrders(): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    const myOrders = await db.query.orders.findMany({
      where: eq(orders.clientId, data.user.id),
      with: {
        products: true,
      },
    })

    return successResponse(myOrders, 200, "Órdenes obtenidas")
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getOrderById(orderId: string): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        products: true,
      },
    })

    if (!order) {
      return errorResponse(404, "Orden no encontrada", "La orden solicitada no existe")
    }

    return successResponse(order, 200)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getAllOrders(): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    const allOrders = await db.query.orders.findMany({
      with: {
        products: true,
      },
    })

    return successResponse(allOrders, 200)
  } catch (error) {
    return handleActionError(error)
  }
}

interface FilterOrdersInput {
  trackingNumber?: string
  productId?: string
  clientId?: string
  clientFullName?: string
}

export async function filterOrders(input: FilterOrdersInput): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    if (!input.trackingNumber && !input.productId && !input.clientId && !input.clientFullName) {
      const allOrders = await db.query.orders.findMany({
        with: {
          products: true,
        },
      })
      return successResponse(allOrders, 200)
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

      if (!client) {
        return successResponse([], 200)
      }

      return successResponse(
        filteredOrders.filter((order) => order.clientId === client.id),
        200
      )
    }

    return successResponse(filteredOrders, 200)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateOrderCosts(
  orderId: string,
  costs: {
    packageCost?: string
    shippingCost?: string
    investedAmount?: string
    paidAmount?: string
  }
): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    const updateData: Record<string, any> = {}

    if (costs.packageCost !== undefined) updateData.packageCost = costs.packageCost
    if (costs.shippingCost !== undefined) updateData.shippingCost = costs.shippingCost
    if (costs.investedAmount !== undefined) updateData.investedAmount = costs.investedAmount
    if (costs.paidAmount !== undefined) updateData.paidAmount = costs.paidAmount

    if (Object.keys(updateData).length === 0) {
      return successResponse({ success: true }, 200)
    }

    await db.update(orders).set(updateData).where(eq(orders.id, orderId))

    return successResponse({ success: true }, 200, "Costos de la orden actualizados")
  } catch (error) {
    return handleActionError(error)
  }
}
