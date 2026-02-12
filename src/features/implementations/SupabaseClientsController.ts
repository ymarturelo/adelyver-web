import IClientsController, { CreateClientRequest, FindClientsRequest, ClientDto } from "../abstractions/IClientsController";
import {  supabaseAdmin } from "../../lib/supabase/server";
import { successResponse, errorResponse, handleActionError, type ApiResponse } from "../../lib/actions/response";
import { Result } from "../shared/Result";

export const SupabaseClientsController: IClientsController = {
  findClients: async (req: FindClientsRequest): Promise<Result<ClientDto[]>> => {
    try {
      const { data, error } = await supabaseAdmin().from("profiles").select("id,full_name,email,phone,created_at");
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });

      let rows = data ?? [];
      if (req.name) {
        rows = rows.filter((r: any) => (r.full_name ?? "").toLowerCase().includes(req.name!.toLowerCase()));
      }
      if (req.phone) {
        rows = rows.filter((r: any) => (r.phone ?? "").includes(req.phone!));
      }

      const dtos: ClientDto[] = rows.map((r: any) => ({
        fullName: r.full_name,
        phone: r.phone,
        email: r.email ?? undefined,
        createdAt: new Date(r.created_at),
      }));

      return Result.ok(dtos);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  createClient: async (req: CreateClientRequest): Promise<Result<void>> => {
    try {
      const { data: userData, error } = await supabaseAdmin().auth.admin.createUser({
        
        email: req.email ?? undefined,
        phone: req.phone ?? undefined,
        password: req.password,
      });

      if (error) {
        
        return Result.err({ code: "AUTH_ERROR", message: error.message });
      }
      if (!userData.user) return Result.err({ code: "USER_CREATION_FAILED", message: "No se creó el usuario" });

      
      const { error: insertError } = await supabaseAdmin().from("profiles").insert({
        id: userData.user.id,
        full_name: req.fullName,
        phone: req.phone ?? null,
        email: req.email ?? null,
        role: "user",
      });

      if (insertError) {
        
        return Result.err({ code: "DB_ERROR", message: insertError.message });
      }

      return Result.ok(undefined);
    } catch (error) {
     
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  deleteCient: async (phone: string): Promise<Result<void>> => {
    try {
      
      const { data: existing } = await supabaseAdmin()
        .from("profiles")
        .select("id")
        .eq("phone", phone)
        .single();

      if (!existing) return Result.err({ code: "NOT_FOUND", message: "Cliente no encontrado" });

      const { error } = await supabaseAdmin().from("profiles").delete().eq("phone", phone);
      
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });

      return Result.ok(undefined);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  loginByPhone: async (phone: string, password: string): Promise<Result<void>> => {
    try {
      const { data, error } = await supabaseAdmin().auth.signInWithPassword({ phone, password } as any);
      if (error) return Result.err({ code: "AUTH_FAILED", message: "Credenciales inválidas" });
      return Result.ok(undefined);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  loginByEmail: async (email: string, password: string): Promise<Result<void>> => {
    try {
      const { data, error } = await supabaseAdmin().auth.signInWithPassword({ email, password } as any);
      if (error) return Result.err({ code: "AUTH_FAILED", message: "Credenciales inválidas" });
      return Result.ok(undefined);
       
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },
};
