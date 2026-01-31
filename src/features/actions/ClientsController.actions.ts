"use server";

import { ioc } from "../ioc";

export const findClientsAction = ioc.ClientsController.findClients;

export const createClientAction = ioc.ClientsController.createClient;

export const deleteCientAction = ioc.ClientsController.deleteCient;

export const loginByPhoneAction = ioc.ClientsController.loginByPhone;

export const loginByEmailAction = ioc.ClientsController.loginByEmail;
