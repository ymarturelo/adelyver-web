import IClientsController from "./abstractions/IClientsController";
import IOrdersController from "./abstractions/IOrderController";
import { MockClientsController } from "./implementations/MockClientsController";
import { MockOrdersController } from "./implementations/MockOrdersController";

export type IocRegistry = {
  OrdersController: IOrdersController;
  ClientsController: IClientsController;
};

export const ioc: IocRegistry = {
  OrdersController: MockOrdersController,
  ClientsController: MockClientsController,
} as const;
