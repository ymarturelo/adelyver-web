import IClientsController, {
  CreateClientRequest,
} from "../abstractions/IClientsController";
import { Result } from "../shared/Result";

let mockClients: CreateClientRequest[] = [];

export const MockClientsController: IClientsController = {
  findClients: async (req) => {
    let filtered = mockClients;
    if (req.name)
      filtered = filtered.filter((c) => c.fullName.includes(req.name!));
    if (req.phone)
      filtered = filtered.filter((c) => c.phone.includes(req.phone!));

    // Remove passwords before returning
    const dtos = filtered.map(({ password, ...rest }) => rest);
    return Result.ok(dtos);
  },

  createClient: async (req) => {
    mockClients.push({ ...req, createdAt: new Date() });
    return Result.ok(undefined);
  },

  deleteCient: async (phone) => {
    mockClients = mockClients.filter((c) => c.phone !== phone);
    return Result.ok(undefined);
  },

  loginByPhone: async (phone, password) => {
    const client = mockClients.find(
      (c) => c.phone === phone && c.password === password
    );
    if (!client) return Result.err({ code: "AUTH_FAILED" });

    // NEXT.JS TIP: In a real Server Action or Route Handler:
    // import { cookies } from 'next/headers'
    // cookies().set('session', 'mock-token')

    return Result.ok(undefined);
  },

  loginByEmail: async (email, password) => {
    const client = mockClients.find(
      (c) => c.email === email && c.password === password
    );
    if (!client) return Result.err({ code: "AUTH_FAILED" });
    return Result.ok(undefined);
  },
};
