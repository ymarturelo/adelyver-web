import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  filterOrders,
  updateOrderCosts,
} from "./orders"
import * as supabaseServer from "@/lib/supabase/server"
import * as db from "@/lib/db"

vi.mock("@/lib/supabase/server")
vi.mock("@/lib/db")

describe("Orders Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createOrder", () => {
    it("should create order with products", async () => {
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

      const result = await createOrder({
        items: [
          {
            storeOrderId: "store-001",
            url: "https://example.com/1",
            name: "Product 1",
          },
        ],
      })

      expect(result.id).toBeDefined()
      expect(mockTransaction).toHaveBeenCalled()
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

      await expect(
        createOrder({
          items: [
            {
              storeOrderId: "store-001",
              url: "https://example.com/1",
              name: "Product 1",
            },
          ],
        })
      ).rejects.toThrow("Unauthorized")
    })
  })

  describe("updateOrderStatus", () => {
    it("should update order status", async () => {
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

      const result = await updateOrderStatus("order-123", "enviado")

      expect(result.success).toBe(true)
      expect(mockUpdate).toHaveBeenCalled()
    })
  })

  describe("deleteOrder", () => {
    it("should delete an order", async () => {
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

      const result = await deleteOrder("order-123")

      expect(result.success).toBe(true)
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe("getMyOrders", () => {
    it("should fetch user's orders", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockOrders = [
        {
          id: "order-1",
          clientId: "user-123",
          status: "revision pendiente",
        },
      ]

      vi.mocked(db.db).query = {
        orders: {
          findMany: vi.fn().mockResolvedValue(mockOrders),
        },
      } as any

      const result = await getMyOrders()

      expect(result).toHaveLength(1)
      expect(result[0].clientId).toBe("user-123")
    })
  })

  describe("getOrderById", () => {
    it("should fetch order by ID with products", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockOrder = {
        id: "order-123",
        clientId: "user-123",
        status: "revision pendiente",
        products: [],
      }

      vi.mocked(db.db).query = {
        orders: {
          findFirst: vi.fn().mockResolvedValue(mockOrder),
        },
      } as any

      const result = await getOrderById("order-123")

      expect(result?.id).toBe("order-123")
      expect(result?.products).toBeDefined()
    })
  })

  describe("getAllOrders", () => {
    it("should fetch all orders", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockOrders = [
        { id: "order-1", clientId: "user-123", status: "revision pendiente" },
        { id: "order-2", clientId: "user-456", status: "enviado" },
      ]

      vi.mocked(db.db).query = {
        orders: {
          findMany: vi.fn().mockResolvedValue(mockOrders),
        },
      } as any

      const result = await getAllOrders()

      expect(result).toHaveLength(2)
    })
  })

  describe("filterOrders", () => {
    it("should filter orders by tracking number", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockOrders = [
        {
          id: "order-1",
          clientId: "user-123",
          status: "revision pendiente",
          products: [
            { id: "prod-1", trackingNumber: "TRACK-123", orderId: "order-1" },
          ],
        },
      ]

      vi.mocked(db.db).query = {
        orders: {
          findMany: vi.fn().mockResolvedValue(mockOrders),
        },
      } as any

      const result = await filterOrders({ trackingNumber: "TRACK-123" })

      expect(result).toHaveLength(1)
      expect((result[0].products as any)[0]?.trackingNumber).toBe("TRACK-123")
    })

    it("should filter orders by product ID", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockOrders = [
        {
          id: "order-1",
          clientId: "user-123",
          status: "revision pendiente",
          products: [{ id: "prod-123", trackingNumber: "TRACK-123", orderId: "order-1" }],
        },
      ]

      vi.mocked(db.db).query = {
        orders: {
          findMany: vi.fn().mockResolvedValue(mockOrders),
        },
      } as any

      const result = await filterOrders({ productId: "prod-123" })

      expect(result).toHaveLength(1)
      expect((result[0].products as any)[0]?.id).toBe("prod-123")
    })

    it("should filter orders by client ID", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockOrders = [
        {
          id: "order-1",
          clientId: "user-456",
          status: "revision pendiente",
          products: [],
        },
      ]

      vi.mocked(db.db).query = {
        orders: {
          findMany: vi.fn().mockResolvedValue(mockOrders),
        },
      } as any

      const result = await filterOrders({ clientId: "user-456" })

      expect(result).toHaveLength(1)
      expect(result[0].clientId).toBe("user-456")
    })

    it("should filter orders by client full name", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockOrders = [
        {
          id: "order-1",
          clientId: "user-456",
          status: "revision pendiente",
          products: [],
        },
      ]

      const mockProfile = { id: "user-456", fullName: "John Doe" }

      vi.mocked(db.db).query = {
        orders: {
          findMany: vi.fn().mockResolvedValue(mockOrders),
        },
        profiles: {
          findFirst: vi.fn().mockResolvedValue(mockProfile),
        },
      } as any

      const result = await filterOrders({ clientFullName: "John Doe" })

      expect(result).toHaveLength(1)
      expect(result[0].clientId).toBe("user-456")
    })

    it("should return all orders if no filters provided", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const mockOrders = [
        { id: "order-1", clientId: "user-123", status: "revision pendiente", products: [] },
        { id: "order-2", clientId: "user-456", status: "enviado", products: [] },
      ]

      vi.mocked(db.db).query = {
        orders: {
          findMany: vi.fn().mockResolvedValue(mockOrders),
        },
      } as any

      const result = await filterOrders({})

      expect(result).toHaveLength(2)
    })
  })

  describe("updateOrderCosts", () => {
    it("should update order costs", async () => {
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

      const result = await updateOrderCosts("order-123", {
        packageCost: "100.00",
        shippingCost: "15.00",
      })

      expect(result.success).toBe(true)
      expect(mockUpdate).toHaveBeenCalled()
    })

    it("should not update if no costs provided", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const result = await updateOrderCosts("order-123", {})

      expect(result.success).toBe(true)
    })
  })
})
