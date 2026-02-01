"use server";

import { ioc } from "../ioc";

export const getClientOrderByIdAction = ioc.OrdersController.getClientOrderById;

export const getClientAllOrdersAction = ioc.OrdersController.getClientAllOrders;

export const getClientOrderProductsAction =
  ioc.OrdersController.getClientOrderProducts;

export const findOrdersAction = ioc.OrdersController.findOrders;

export const createOrderByClientAction =
  ioc.OrdersController.createOrderByClient;

export const createOrderByAdminAction = ioc.OrdersController.createOrderByAdmin;

export const updateOrderByAdminAction = ioc.OrdersController.updateOrderByAdmin;

export const createProductByAdminAction =
  ioc.OrdersController.createProductByAdmin;

export const updateProductByAdminAction =
  ioc.OrdersController.updateProductByAdmin;

export const deleteProductByAdminAction =
  ioc.OrdersController.deleteProductByAdmin;
