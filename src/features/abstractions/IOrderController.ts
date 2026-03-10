import { OrderModel, OrderStatus } from "../models/OrderModel";
import { ProductModel } from "../models/ProductModel";
import { Result } from "../shared/Result";

export default interface IOrdersController {
  getClientOrderById: (orderId: string) => Promise<Result<ClientOrderDto>>;

  getClientAllOrders: () => Promise<Result<ClientOrderDto[]>>;

  getClientOrderProducts: (orderId: string) => Promise<Result<ProductModel[]>>;

  findOrders: (req: FindOrdersRequest) => Promise<Result<OrderDto[]>>;

  createOrderByClient: (
    req: CreateOrderByClientRequest
  ) => Promise<Result<void>>;

  updateOrderByClient: (
    req: UpdateOrderByClientRequest
  ) => Promise<Result<void>>;

  createOrderByAdmin: (
    req: CreateOrderByAdminRequest
  ) => Promise<Result<{ id: string }>>;

  updateOrderByAdmin: (req: UpdateOrderByAdminRequest) => Promise<Result<void>>;

  createProductByAdmin: (req: CreateProductRequest) => Promise<Result<void>>;

  updateProductByAdmin: (req: UpdateProductRequest) => Promise<Result<void>>;

  deleteProductByAdmin: (id: string) => Promise<Result<void>>;
}

export type OrderDto = OrderModel & {
  productSummary: string;
  createdBy: string;
};

export type ClientOrderDto = Omit<OrderDto, "spentMoney">;

export type FindOrdersRequest = {
  trackingNumber?: string;
  storeProductId?: string;
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

export type UpdateOrderByClientRequest = {
  orderId: string;
  shopCartUrl: string;
};

export type UpdateOrderByAdminRequest = {
  orderId: string;
  status?: OrderStatus;
  packagePrice?: number;
  deliveryPrice?: number;
  spentMoney?: number;
  moneyPaidByClient?: number;
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
