import IClientsController, {
  CreateClientRequest,
  FindClientsRequest,
  ClientDto,
} from "../abstractions/IClientsController";
import { supabaseAdmin, supabaseClient } from "../../lib/supabase/server";
import { Result } from "../shared/Result";
import { headers } from "next/headers";

async function isAdmin(): Promise<boolean> {
  const supabase = await supabaseClient(); // Cookie-based client
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if the user has the admin role in their metadata
  return (
    user?.app_metadata?.role === "admin" ||
    user?.user_metadata?.role === "admin"
  );
}

export const SupabaseClientsController: IClientsController = {
  findClients: async (
    req: FindClientsRequest
  ): Promise<Result<ClientDto[]>> => {
    try {
      if (!(await isAdmin()))
        return Result.err({
          code: "UNAUTHORIZED",
          message: "No tienes permisos",
        });
      const { data, error } = await supabaseAdmin().auth.admin.listUsers();

      if (error) {
        return Result.err({ code: error.code + "", message: error.message });
      }

      const filteredUsers = data.users.filter((u) => {
        if (u.app_metadata?.role === "admin") return false;
        if (!req.phone && !req.name) return true;
        if (
          req.name &&
          u.user_metadata?.full_name
            ?.toLowerCase()
            .includes(req.name.toLowerCase())
        ) {
          return true;
        }
        if (req.phone && u.phone?.includes(req.phone)) {
          return true;
        }
        return false;
      });

      const dtos = filteredUsers.map(
        (u) =>
          ({
            fullName: u.user_metadata?.full_name,
            phone: u.phone!,
            email: u.email ?? undefined,
            createdAt: new Date(u.created_at),
          } satisfies ClientDto)
      );

      return Result.ok(dtos);
    } catch (error) {
      if (error instanceof Error) {
        return Result.err({
          code: error.name,
          message: error.message,
        });
      }

      return Result.err({
        code: "UNKNOWN_ERROR",
        message: "Ocurrió un error inesperado",
      });
    }
  },

  createClient: async (req: CreateClientRequest): Promise<Result<void>> => {
    try {
      if (!(await isAdmin()))
        return Result.err({
          code: "UNAUTHORIZED",
          message: "No tienes permisos",
        });
      const supabase = supabaseAdmin();

      const { error } = await supabase.auth.admin.createUser({
        email: req.email ?? undefined,
        phone: req.phone ?? undefined,
        password: req.password,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: {
          full_name: req.fullName,
        },
      });

      if (error) {
        return Result.err({ code: error.code + "", message: error.message });
      }

      return Result.ok(undefined);
    } catch (error) {
      if (error instanceof Error) {
        return Result.err({
          code: error.name,
          message: error.message,
        });
      }

      return Result.err({
        code: "UNKNOWN_ERROR",
        message: "Ocurrió un error inesperado",
      });
    }
  },

  loginByPhone: async (
    phone: string,
    password: string
  ): Promise<Result<void>> => {
    try {
      const supabase = await supabaseClient();

      const { error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });
      if (error)
        return Result.err({
          code: "AUTH_FAILED",
          message: "Credenciales inválidas",
        });
      return Result.ok(undefined);
    } catch (error) {
      if (error instanceof Error) {
        return Result.err({
          code: error.name,
          message: error.message,
        });
      }

      return Result.err({
        code: "UNKNOWN_ERROR",
        message: "Ocurrió un error inesperado",
      });
    }
  },

  loginByEmail: async (
    email: string,
    password: string
  ): Promise<Result<void>> => {
    try {
      const supabase = await supabaseClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error)
        return Result.err({
          code: "AUTH_FAILED",
          message: "Credenciales inválidas",
        });
      return Result.ok(undefined);
    } catch (error) {
      if (error instanceof Error) {
        return Result.err({
          code: error.name,
          message: error.message,
        });
      }

      return Result.err({
        code: "UNKNOWN_ERROR",
        message: "Ocurrió un error inesperado",
      });
    }
  },

  getCurrentUser: async () => {
    try {
      const supabase = await supabaseClient();

      const { data, error } = await supabase.auth.getClaims();
      if (error) {
        return Result.err({
          code: error.code + "",
          message: error.message,
          data: error,
        });
      }

      const claims = data?.claims;

      if (claims) {
        return Result.ok({
          fullName: (claims.user_metadata?.full_name as string) ?? "UNKNOWN",
          phone: claims.phone!,
          email: claims.email,
        });
      }

      return Result.ok(null);
    } catch (error) {
      if (error instanceof Error) {
        return Result.err({
          code: error.name,
          message: error.message,
        });
      }

      return Result.err({
        code: "UNKNOWN_ERROR",
        message: "Ocurrió un error inesperado",
      });
    }
  },

  signup: async (req: CreateClientRequest): Promise<Result<void>> => {
    try {
      const supabase = await supabaseClient();

      const headerList = await headers();
      const host = headerList.get("host");
      const protocol = headerList.get("x-forwarded-proto") ?? "http";

      const origin = `${protocol}://${host}`;

      const { error } = await supabase.auth.signUp({
        email: req.email!,
        password: req.password,
        options: {
          emailRedirectTo: `${origin}/auth/verification-callback`,
          data: {
            full_name: req.fullName,
            phone_number: req.phone,
          },
        },
      });

      if (error) {
        return Result.err({ code: error.code + "", message: error.message });
      }

      return Result.ok(undefined);
    } catch (error) {
      if (error instanceof Error) {
        return Result.err({
          code: error.name,
          message: error.message + "LOL",
        });
      }

      return Result.err({
        code: "UNKNOWN_ERROR",
        message: "Ocurrió un error inesperado",
      });
    }
  },

  logout: async function (): Promise<Result<void>> {
    const supabase = await supabaseClient();
    await supabase.auth.signOut();
    return Result.ok(undefined);
  },

  isAdmin: async function (): Promise<Result<boolean>> {
    const supabase = await supabaseClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error) {
      return Result.err({ code: error.code + "", message: error.message });
    }

    return Result.ok(data?.claims.app_metadata?.role === "admin");
  },

  isAuthenticated: async function (): Promise<Result<boolean>> {
    const supabase = await supabaseClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error) {
      return Result.err({ code: error.code + "", message: error.message });
    }

    return Result.ok(data?.claims.role === "authenticated");
  },
};
