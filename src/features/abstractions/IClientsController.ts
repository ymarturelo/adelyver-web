import { Result } from "../shared/Result";

export default interface IClientsController {
  findClients: (req: FindClientsRequest) => Promise<Result<ClientDto[]>>;

  createClient: (req: CreateClientRequest) => Promise<Result<void>>;

  deleteCient: (phone: string) => Promise<Result<void>>;

  loginByPhone: (phone: string, password: string) => Promise<Result<void>>;

  loginByEmail: (email: string, password: string) => Promise<Result<void>>;
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

export type CreateClientRequest = ClientDto & {
  password: string;
};
