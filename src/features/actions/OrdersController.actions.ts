"use server";

import { withNetworkRls, withSessionRls } from "./decorators/rls.decorator";
import createAction from "./createAction";
export const getClientOrderByIdAction = createAction((ioc, tx) =>
  withSessionRls(tx, ioc.OrdersController.getClientOrderById)
);

export const getClientAllOrdersAction = createAction((ioc, tx) =>
  withSessionRls(tx, ioc.OrdersController.getClientAllOrders)
);

export const getClientOrderProductsAction = createAction((ioc, tx) =>
  withSessionRls(tx, ioc.OrdersController.getClientOrderProducts)
);

export const findOrdersAction = createAction((ioc, tx) =>
  withSessionRls(tx, ioc.OrdersController.findOrders)
);

export const createOrderByClientAction = createAction((ioc, tx) =>
  withNetworkRls(tx, ioc.OrdersController.createOrderByClient)
);

export const updateOrderByClientAction = createAction((ioc, tx) =>
  withNetworkRls(tx, ioc.OrdersController.updateOrderByClient)
);

export const createOrderByAdminAction = createAction((ioc, tx) =>
  withNetworkRls(tx, ioc.OrdersController.createOrderByAdmin)
);

export const updateOrderByAdminAction = createAction((ioc, tx) =>
  withNetworkRls(tx, ioc.OrdersController.updateOrderByAdmin)
);

export const createProductByAdminAction = createAction((ioc, tx) =>
  withNetworkRls(tx, ioc.OrdersController.createProductByAdmin)
);

export const updateProductByAdminAction = createAction((ioc, tx) =>
  withNetworkRls(tx, ioc.OrdersController.updateProductByAdmin)
);

export const deleteProductByAdminAction = createAction((ioc, tx) =>
  withNetworkRls(tx, ioc.OrdersController.deleteProductByAdmin)
);
