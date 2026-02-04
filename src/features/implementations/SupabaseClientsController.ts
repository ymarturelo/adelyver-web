import IClientsController, { CreateClientRequest, FindClientsRequest, ClientDto } from "../abstractions/IClientsController";
import {  supabaseAdmin } from "@/lib/supabase/server";
import { successResponse, errorResponse, handleActionError, type ApiResponse } from "@/lib/actions/response";

export const SupabaseClientsController: IClientsController = {
  findClients: async (req: FindClientsRequest): Promise<ApiResponse<ClientDto[]>> => {
    try {
      const { data, error } = await supabaseAdmin().from("profiles").select("id,full_name,email,phone,created_at");
      if (error) return errorResponse(400, error.message, "Error al buscar clientes");

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

      return successResponse(dtos, 200, "Clientes obtenidos exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  createClient: async (req: CreateClientRequest): Promise<ApiResponse> => {
    try {
      const { data: userData, error } = await supabaseAdmin().auth.admin.createUser({
        email: req.email ?? undefined,
        phone: req.phone ?? undefined,
        password: req.password,
      });

      if (error) {
        
        return errorResponse(400, error.message, "No se pudo crear el usuario");
      }
      if (!userData.user) return errorResponse(500, "No se creó el usuario", "Error al crear usuario");

      
      const { error: insertError } = await supabaseAdmin().from("profiles").insert({
        id: userData.user.id,
        full_name: req.fullName,
        phone: req.phone ?? null,
        email: req.email ?? null,
        role: "user",
      });

      if (insertError) {
        
        return errorResponse(400, insertError.message, "No se pudo crear el perfil");
      }

      return successResponse({ id: userData.user.id }, 201, "Cliente creado exitosamente");
    } catch (error) {
     
      return handleActionError(error);
    }
  },

  deleteCient: async (phone: string): Promise<ApiResponse<void>> => {
    try {
      
      const { data: existing } = await supabaseAdmin()
        .from("profiles")
        .select("id")
        .eq("phone", phone)
        .single();

      if (!existing) return errorResponse(404, "Cliente no encontrado", "El cliente no existe");

      const { error } = await supabaseAdmin().from("profiles").delete().eq("phone", phone);
      
      if (error) return errorResponse(400, error.message, "Error al eliminar el cliente");

      return successResponse(undefined, 200, "Cliente eliminado exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  loginByPhone: async (phone: string, password: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabaseAdmin().auth.signInWithPassword({ phone, password } as any);
      if (error) return errorResponse(401, "Credenciales inválidas", "Autenticación fallida");
      return successResponse({
        user: data.user,
        session: data.session,
      }, 200, "Inicio de sesión exitoso");
    } catch (error) {
      return handleActionError(error);
    }
  },

  loginByEmail: async (email: string, password: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabaseAdmin().auth.signInWithPassword({ email, password } as any);
      if (error) return errorResponse(401, "Credenciales inválidas", "Autenticación fallida");
      return successResponse({
        user: data.user,
        session: data.session,
      }, 200, "Inicio de sesión exitoso");
    } catch (error) {
      return handleActionError(error);
    }
  },
};
