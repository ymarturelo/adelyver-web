import { supabaseAdmin, supabase } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { randomUUID } from "crypto"

interface RegisterInput {
  email?: string
  password: string
  fullName: string
  phone?: string
  role?: "user" | "admin"
}

export async function registerUser({ email,password, fullName, phone, role = "user" }: RegisterInput) {
  
  if (!email && !phone) {
    throw new Error("Se requiere al menos email o phone");
  }
   const { data: userData, error } = await supabaseAdmin().auth.admin.createUser({
    password,
    email,
    phone,
  });

  if (error) throw new Error(error.message)
  if (!userData.user) throw new Error("No se pudo crear el usuario")

  
  await db.insert(profiles).values({
    id: randomUUID(),
    fullName,
    phone: phone ?? null,
    email: email ?? null,
    role
  })

  return { id: userData.user.id}
}

interface LoginInput {
  phone?: string
  email?: string
  password: string
}

export async function loginUser({ phone, email, password }: LoginInput) {
   if (!email && !phone) {
    throw new Error("Se requiere email o teléfono para iniciar sesión");
  }
  
  let credentials: { email?: string; phone?: string; password: string };
  
  if (email) {
    credentials = { email, password };
  } else {
    credentials = { phone: phone!, password };
  }
  
  const { data, error } = await supabase().auth.signInWithPassword(credentials as any)

  if (error) throw new Error(error.message)

  // data.session contiene access_token y refresh_token
  return {
    user: data.user,
    session: data.session
  }
}
