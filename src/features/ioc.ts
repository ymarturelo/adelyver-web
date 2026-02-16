import IClientsController from "./abstractions/IClientsController";
import IOrdersController from "./abstractions/IOrderController";
import { TransactionType } from "./implementations/db";
import { SupabaseClientsController } from "./implementations/SupabaseClientsController";
import { createSupabaseOrdersController } from "./implementations/SupabaseOrdersController";

export type IocRegistry = {
  OrdersController: IOrdersController;
  ClientsController: IClientsController;
};

export const getIoc = (tx: TransactionType) => {
  return {
    OrdersController: createSupabaseOrdersController(tx),
    ClientsController: SupabaseClientsController,
  } as const;
};
