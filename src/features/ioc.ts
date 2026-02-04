import IClientsController from "./abstractions/IClientsController";
import IOrdersController from "./abstractions/IOrderController";

import { SupabaseClientsController } from "./implementations/SupabaseClientsController";
import { SupabaseOrdersController } from "./implementations/SupabaseOrdersController";

export type IocRegistry = {
  OrdersController: IOrdersController;
  ClientsController: IClientsController;
};

export const ioc: IocRegistry = {
  
  OrdersController: SupabaseOrdersController,
  ClientsController: SupabaseClientsController,
} as const;
