import { OrderModel, OrderStatus } from "../models/OrderModel";
import { ProductModel } from "../models/ProductModel";
import { Result } from "../shared/Result";
import type { ApiResponse } from "@/lib/actions/response";

export default interface IOrdersController {
  getClientOrderById: (orderId: string) => Promise<ApiResponse<ClientOrderDto>>;

  getClientAllOrders: () => Promise<ApiResponse<ClientOrderDto[]>>;

  getClientOrderProducts: (orderId: string) => Promise<ApiResponse<ProductModel[]>>;

  findOrders: (req: findOrdersRequest) => Promise<ApiResponse<OrderModel[]>>;

  createOrderByClient: (
    req: CreateOrderByClientRequest
  ) => Promise<ApiResponse>;

  createOrderByAdmin: (
    req: CreateOrderByAdminRequest
  ) => Promise<ApiResponse<{ id: string }>>;

  updateOrderByAdmin: (req: UpdateOrderByAdminRequest) => Promise<ApiResponse>;

  createProductByAdmin: (req: CreateProductRequest) => Promise<ApiResponse>;

  updateProductByAdmin: (req: UpdateProductRequest) => Promise<ApiResponse>;

  deleteProductByAdmin: (id: string) => Promise<ApiResponse<void>>;
}

export type ClientOrderDto = Omit<OrderModel, "shopCartUrl" | "spentMoney">;

export type findOrdersRequest = {
  trackingNumber?: string;
  productId?: string;
  clientNumber?: string;
  clientName?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  ignoreCancelled: boolean;
  ignoreDelievered: boolean;
};

export type CreateOrderByClientRequest = {
  shopCartUrl: string;
};

export type CreateOrderByAdminRequest = {
  clientId: string;
  status: OrderStatus;
  packagePrice?: number;
  deliveryPrice?: number;
};

export type UpdateOrderByAdminRequest = {
  orderId: string;
  status?: OrderStatus;
  packagePrice?: number;
  deliveryPrice?: number;
  spentMoney: number;
  paidByClient: number;
};

export type CreateProductRequest = {
  orderId: string;
  trackingNumber: string;
  name: string;
  idFromShop: string;
  url: string;
};

export type UpdateProductRequest = {
  id: string;
  trackingNumber?: string;
  name?: string;
  idFromShop?: string;
  url?: string;
};
