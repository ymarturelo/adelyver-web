import IClientsController from "./abstractions/IClientsController";
import IOrdersController from "./abstractions/IOrderController";
import decorateWithRLS from "./implementations/decorators/RLSDecorator";
import { SupabaseClientsController } from "./implementations/SupabaseClientsController";
import { createSupabaseOrdersController } from "./implementations/SupabaseOrdersController";

export type IocRegistry = {
  OrdersController: IOrdersController;
  ClientsController: IClientsController;
};

export const getIoc = () => {
  return {
    OrdersController: decorateWithRLS(createSupabaseOrdersController),
    ClientsController: SupabaseClientsController,
  } as const;
};
