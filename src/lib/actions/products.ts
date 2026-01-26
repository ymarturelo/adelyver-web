"use server"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { supabase } from "@/lib/supabase/server"
import { eq } from "drizzle-orm"
import { successResponse, errorResponse, handleActionError, type ApiResponse } from "./response"

interface CreateProductInput {
  orderId: string
  storeOrderId: string
  url: string
  name: string
  trackingNumber?: string
}

export async function createProduct(input: CreateProductInput): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    const productId = crypto.randomUUID()

    await db.insert(products).values({
      id: productId,
      orderId: input.orderId,
      storeOrderId: input.storeOrderId,
      url: input.url,
      name: input.name,
      trackingNumber: input.trackingNumber || null,
    })

    return successResponse({ id: productId }, 201, "Producto creado exitosamente")
  } catch (error) {
    return handleActionError(error)
  }
}

export async function createBulkProducts(
  orderId: string,
  items: Omit<CreateProductInput, "orderId">[]
): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    const createdProducts: Array<{ id: string } & Omit<CreateProductInput, "orderId">> = []

    await db.transaction(async (tx) => {
      for (const item of items) {
        const productId = crypto.randomUUID()
        await tx.insert(products).values({
          id: productId,
          orderId,
          storeOrderId: item.storeOrderId,
          url: item.url,
          name: item.name,
          trackingNumber: item.trackingNumber || null,
        })
        createdProducts.push({ id: productId, ...item })
      }
    })

    return successResponse(createdProducts, 201, "Productos creados exitosamente")
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getProductsByOrder(orderId: string): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    const orderProducts = await db.query.products.findMany({
      where: eq(products.orderId, orderId),
    })

    return successResponse(orderProducts, 200)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getProductById(productId: string): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    })

    if (!product) {
      return errorResponse(404, "Producto no encontrado", "El producto solicitado no existe")
    }

    return successResponse(product, 200)
  } catch (error) {
    return handleActionError(error)
  }
}

interface UpdateProductInput {
  name?: string
  url?: string
  trackingNumber?: string
  storeOrderId?: string
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput
): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    const updateData: Partial<typeof input> = {}

    if (input.name !== undefined) updateData.name = input.name
    if (input.url !== undefined) updateData.url = input.url
    if (input.trackingNumber !== undefined) updateData.trackingNumber = input.trackingNumber
    if (input.storeOrderId !== undefined) updateData.storeOrderId = input.storeOrderId

    if (Object.keys(updateData).length === 0) {
      return successResponse({ id: productId }, 200)
    }

    await db.update(products).set(updateData as any).where(eq(products.id, productId))

    return successResponse({ id: productId }, 200, "Producto actualizado exitosamente")
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteProduct(productId: string): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    await db.delete(products).where(eq(products.id, productId))

    return successResponse({ success: true }, 200, "Producto eliminado exitosamente")
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateTrackingNumber(
  productId: string,
  trackingNumber: string
): Promise<ApiResponse> {
  try {
    const { data } = await supabase().auth.getUser()
    if (!data.user) {
      return errorResponse(401, "Unauthorized", "Usuario no autenticado")
    }

    await db.update(products).set({ trackingNumber }).where(eq(products.id, productId))

    return successResponse({ trackingNumber }, 200, "Número de seguimiento actualizado")
  } catch (error) {
    return handleActionError(error)
  }
}
