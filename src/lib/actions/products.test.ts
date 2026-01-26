import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  createProduct,
  createBulkProducts,
  getProductsByOrder,
  getProductById,
  updateProduct,
  deleteProduct,
  updateTrackingNumber,
} from "./products"
import * as supabaseServer from "@/lib/supabase/server"
import * as db from "@/lib/db"

vi.mock("@/lib/supabase/server")
vi.mock("@/lib/db")

describe("Products Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      })

      vi.mocked(db.db).insert = mockInsert

      const result = await createProduct({
        orderId: "order-123",
        storeOrderId: "store-001",
        url: "https://example.com/product",
        name: "Test Product",
        trackingNumber: "TRACK-123",
      })

      expect(result.success).toBe(true)
      expect(result.status).toBe(201)
      expect(result.data?.id).toBeDefined()
      expect(mockInsert).toHaveBeenCalled()
    })

    it("should throw error if user is not authenticated", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const res = await createProduct({
        orderId: "order-123",
        storeOrderId: "store-001",
        url: "https://example.com/product",
        name: "Test Product",
      })

      expect(res.success).toBe(false)
      expect(res.status).toBe(401)
    })
  })

  describe("createBulkProducts", () => {
    it("should create multiple products in a transaction", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockTransaction = vi.fn().mockImplementation(async (cb) => {
        const tx = {
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockResolvedValue(undefined),
          }),
        }
        await cb(tx)
      })

      vi.mocked(db.db).transaction = mockTransaction

      const items = [
        {
          storeOrderId: "store-001",
          url: "https://example.com/1",
          name: "Product 1",
        },
        {
          storeOrderId: "store-002",
          url: "https://example.com/2",
          name: "Product 2",
        },
      ]

      const result = await createBulkProducts("order-123", items)

      expect(result.success).toBe(true)
      expect(result.status).toBe(201)
      expect(result.data).toHaveLength(2)
      expect(mockTransaction).toHaveBeenCalled()
    })
  })

  describe("getProductsByOrder", () => {
    it("should fetch products by order ID", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockProducts = [
        { id: "prod-1", name: "Product 1", orderId: "order-123" },
        { id: "prod-2", name: "Product 2", orderId: "order-123" },
      ]

      vi.mocked(db.db).query = {
        products: {
          findMany: vi.fn().mockResolvedValue(mockProducts),
        },
      } as any

      const result = await getProductsByOrder("order-123")

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.data[0].name).toBe("Product 1")
    })
  })

  describe("getProductById", () => {
    it("should fetch a product by ID", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockProduct = {
        id: "prod-1",
        name: "Test Product",
        url: "https://example.com",
      }

      vi.mocked(db.db).query = {
        products: {
          findFirst: vi.fn().mockResolvedValue(mockProduct),
        },
      } as any

      const result = await getProductById("prod-1")

      expect(result.success).toBe(true)
      expect(result.data.name).toBe("Test Product")
    })
  })

  describe("updateProduct", () => {
    it("should update product fields", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      })

      vi.mocked(db.db).update = mockUpdate

      const result = await updateProduct("prod-1", {
        name: "Updated Name",
        trackingNumber: "TRACK-456",
      })

      expect(result.success).toBe(true)
      expect(result.data.id).toBe("prod-1")
      expect(mockUpdate).toHaveBeenCalled()
    })
  })

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockDelete = vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      })

      vi.mocked(db.db).delete = mockDelete

      const result = await deleteProduct("prod-1")

      expect(result.success).toBe(true)
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe("updateTrackingNumber", () => {
    it("should update tracking number for a product", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      })

      vi.mocked(db.db).update = mockUpdate

      const result = await updateTrackingNumber(
        "prod-1",
        "TRACK-NEW-789"
      )

      expect(result.success).toBe(true)
      expect(result.data.trackingNumber).toBe("TRACK-NEW-789")
      expect(mockUpdate).toHaveBeenCalled()
    })
  })
})
