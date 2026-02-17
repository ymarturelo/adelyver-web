"use server";

import { withSessionRls } from "./decorators/rls.decorator";
import createAction from "./createAction";

export const findClientsAction = createAction((ioc, tx) =>
  withSessionRls(tx, ioc.ClientsController.findClients)
);

export const createClientAction = createAction(
  (ioc) => ioc.ClientsController.createClient
);

export const loginByPhoneAction = createAction(
  (ioc) => ioc.ClientsController.loginByPhone
);

export const loginByEmailAction = createAction(
  (ioc) => ioc.ClientsController.loginByEmail
);

export const signupAction = createAction((ioc) => ioc.ClientsController.signup);

export const logoutAction = createAction((ioc) => ioc.ClientsController.logout);

export const isAdmin = createAction((ioc) => ioc.ClientsController.isAdmin);

export const isAuthenticated = createAction(
  (ioc) => ioc.ClientsController.isAuthenticated
);
