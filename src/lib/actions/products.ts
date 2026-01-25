"use server"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { supabase } from "@/lib/supabase/server"
import { eq } from "drizzle-orm"

interface CreateProductInput {
  orderId: string
  storeOrderId: string
  url: string
  name: string
  trackingNumber?: string
}

export async function createProduct(input: CreateProductInput) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  const productId = crypto.randomUUID()

  await db.insert(products).values({
    id: productId,
    orderId: input.orderId,
    storeOrderId: input.storeOrderId,
    url: input.url,
    name: input.name,
    trackingNumber: input.trackingNumber || null,
  })

  return { id: productId }
}

export async function createBulkProducts(
  orderId: string,
  items: Omit<CreateProductInput, "orderId">[]
) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

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

  return createdProducts
}

export async function getProductsByOrder(orderId: string) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  return db.query.products.findMany({
    where: eq(products.orderId, orderId),
  })
}

export async function getProductById(productId: string) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  return db.query.products.findFirst({
    where: eq(products.id, productId),
  })
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
) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  const updateData: Partial<typeof input> = {}

  if (input.name !== undefined) updateData.name = input.name
  if (input.url !== undefined) updateData.url = input.url
  if (input.trackingNumber !== undefined)
    updateData.trackingNumber = input.trackingNumber
  if (input.storeOrderId !== undefined)
    updateData.storeOrderId = input.storeOrderId

  if (Object.keys(updateData).length === 0) {
    return { id: productId }
  }

  await db
    .update(products)
    .set(updateData as any)
    .where(eq(products.id, productId))

  return { id: productId }
}

export async function deleteProduct(productId: string) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  await db.delete(products).where(eq(products.id, productId))

  return { success: true }
}

export async function updateTrackingNumber(
  productId: string,
  trackingNumber: string
) {
  const { data } = await supabase().auth.getUser()
  if (!data.user) throw new Error("Unauthorized")

  await db
    .update(products)
    .set({ trackingNumber })
    .where(eq(products.id, productId))

  return { trackingNumber }
}
