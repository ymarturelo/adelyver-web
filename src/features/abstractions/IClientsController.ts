import { Result } from "../shared/Result";
import type { ApiResponse } from "@/lib/actions/response";

export default interface IClientsController {
  findClients: (req: FindClientsRequest) => Promise<ApiResponse<ClientDto[]>>;

  createClient: (req: CreateClientRequest) => Promise<ApiResponse>;

  deleteCient: (phone: string) => Promise<ApiResponse<void>>;

  loginByPhone: (phone: string, password: string) => Promise<ApiResponse>;
  loginByEmail: (email: string, password: string) => Promise<ApiResponse>;
}

export type ClientDto = {
  fullName: string;
  phone: string;
  email?: string;
  createdAt: Date;
};

export type FindClientsRequest = {
  name?: string;
  phone?: string;
};

export type CreateClientRequest = Omit<ClientDto, "phone" | "email" | "createdAt"> & {
  password: string;
  phone?: string;
  email?: string;
};
