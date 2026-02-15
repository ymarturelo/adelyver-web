"use server";

import { createAction } from "./createAction";

export const findClientsAction = createAction(
  "ClientsController",
  "findClients"
);

export const createClientAction = createAction(
  "ClientsController",
  "createClient"
);

export const loginByPhoneAction = createAction(
  "ClientsController",
  "loginByPhone"
);

export const loginByEmailAction = createAction(
  "ClientsController",
  "loginByEmail"
);
