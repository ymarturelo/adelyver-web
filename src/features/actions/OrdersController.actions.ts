"use server";

import { createAction } from "./createAction";

export const getClientOrderByIdAction = createAction(
  "OrdersController",
  "getClientOrderById"
);

export const getClientAllOrdersAction = createAction(
  "OrdersController",
  "getClientAllOrders"
);

export const getClientOrderProductsAction = createAction(
  "OrdersController",
  "getClientOrderProducts"
);

export const findOrdersAction = createAction("OrdersController", "findOrders");

export const createOrderByClientAction = createAction(
  "OrdersController",
  "createOrderByClient"
);

export const createOrderByAdminAction = createAction(
  "OrdersController",
  "createOrderByAdmin"
);

export const updateOrderByAdminAction = createAction(
  "OrdersController",
  "updateOrderByAdmin"
);

export const createProductByAdminAction = createAction(
  "OrdersController",
  "createProductByAdmin"
);

export const updateProductByAdminAction = createAction(
  "OrdersController",
  "updateProductByAdmin"
);

export const deleteProductByAdminAction = createAction(
  "OrdersController",
  "deleteProductByAdmin"
);
