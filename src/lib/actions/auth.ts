import { supabaseAdmin, supabase } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { randomUUID } from "crypto"
import { successResponse, errorResponse, handleActionError, type ApiResponse } from "./response"

interface RegisterInput {
  email?: string
  password: string
  fullName: string
  phone?: string
  role?: "user" | "admin"
}

export async function registerUser({ email, password, fullName, phone, role = "user" }: RegisterInput): Promise<ApiResponse> {
  try {
    if (!email && !phone) {
      return errorResponse(400, "Se requiere al menos email o phone")
    }

    const { data: userData, error } = await supabaseAdmin().auth.admin.createUser({
      password,
      email,
      phone,
    })

    if (error) {
      return errorResponse(400, error.message, "No se pudo crear el usuario")
    }

    if (!userData.user) {
      return errorResponse(500, "No se pudo crear el usuario")
    }

    await db.insert(profiles).values({
      id: randomUUID(),
      fullName,
      phone: phone ?? null,
      email: email ?? null,
      role,
    })

    return successResponse({ id: userData.user.id }, 201, "Usuario registrado exitosamente")
  } catch (error) {
    return handleActionError(error)
  }
}

interface LoginInput {
  phone?: string
  email?: string
  password: string
}

export async function loginUser({ phone, email, password }: LoginInput): Promise<ApiResponse> {
  try {
    if (!email && !phone) {
      return errorResponse(400, "Se requiere email o teléfono para iniciar sesión")
    }

    let credentials: { email?: string; phone?: string; password: string }

    if (email) {
      credentials = { email, password }
    } else {
      credentials = { phone: phone!, password }
    }

    const { data, error } = await supabase().auth.signInWithPassword(credentials as any)

    if (error) {
      return errorResponse(401, error.message, "Credenciales inválidas")
    }

    // data.session contiene access_token y refresh_token
    return successResponse(
      {
        user: data.user,
        session: data.session,
      },
      200,
      "Sesión iniciada exitosamente"
    )
  } catch (error) {
    return handleActionError(error)
  }}