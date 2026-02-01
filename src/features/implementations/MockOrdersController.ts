import IOrdersController, {
  ClientOrderDto,
} from "../abstractions/IOrderController";
import { OrderModel } from "../models/OrderModel";
import { ProductModel } from "../models/ProductModel";
import { Result } from "../shared/Result";

// Mock Database State
const mockOrders: OrderModel[] = [];
const mockProducts: ProductModel[] = [];

export const MockOrdersController: IOrdersController = {
  getClientOrderById: async (orderId) => {
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order)
      return Result.err({
        code: "ORDER_NOT_FOUND",
      });
    const { shopCartUrl, spentMoney, ...clientDto } = order;
    return Result.ok(clientDto);
  },

  getClientAllOrders: async () => {
    const dtos: ClientOrderDto[] = mockOrders.map(
      ({ shopCartUrl, spentMoney, ...rest }) => rest
    );
    return Result.ok(dtos);
  },

  getClientOrderProducts: async (orderId) => {
    const products = mockProducts.filter((p) => p.orderId === orderId);
    return Result.ok(products);
  },

  findOrders: async (req) => {
    let filtered = [...mockOrders];
    if (req.ignoreCancelled)
      filtered = filtered.filter((o) => o.status !== "cancelled");
    if (req.ignoreDelievered)
      filtered = filtered.filter((o) => o.status !== "delivered");
    if (req.clientName)
      filtered = filtered.filter((o) => o.clientId.includes(req.clientName!));
    return Result.ok(filtered);
  },

  createOrderByClient: async (req) => {
    const newOrder: OrderModel = {
      id: Buffer.from(Math.random().toString()).toString("hex").slice(0, 8),
      clientId: "current-auth-user-id",
      status: "pending_review",
      packagePrice: 0,
      deliveryPrice: 0,
      spentMoney: 0,
      moneyPaidByClient: 0,
      shopCartUrl: req.shopCartUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockOrders.push(newOrder);
    return Result.ok(undefined);
  },

  createOrderByAdmin: async (req) => {
    const id = Math.random().toString(36).substr(2, 9);
    mockOrders.push({
      id,
      ...req,
      packagePrice: req.packagePrice ?? 0,
      deliveryPrice: req.deliveryPrice ?? 0,
      spentMoney: 0,
      moneyPaidByClient: 0,
      shopCartUrl: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return Result.ok({ id });
  },

  updateOrderByAdmin: async (req) => {
    const index = mockOrders.findIndex((o) => o.id === req.orderId);
    if (index === -1) return Result.err({ code: "ORDER_NOT_FOUND" });

    mockOrders[index] = {
      ...mockOrders[index],
      ...req,
      moneyPaidByClient: req.paidByClient, // mapping name difference
      updatedAt: new Date(),
    };
    return Result.ok(undefined);
  },

  createProductByAdmin: async (req) => {
    mockProducts.push({
      ...req,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return Result.ok(undefined);
  },

  updateProductByAdmin: async (req) => {
    const index = mockProducts.findIndex((p) => p.id === req.id);
    if (index === -1) return Result.err({ code: "PRODUCT_NOT_FOUND" });
    mockProducts[index] = {
      ...mockProducts[index],
      ...req,
      updatedAt: new Date(),
    };
    return Result.ok(undefined);
  },

  deleteProductByAdmin: async (id) => {
    return Result.ok(undefined);
  },
};
