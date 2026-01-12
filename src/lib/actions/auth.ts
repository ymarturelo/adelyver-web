import { supabaseAdmin } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { randomUUID } from "crypto"

interface RegisterInput {
  
  password: string
  fullName: string
  phone: string
  role?: "user" | "admin"
}

export async function registerUser({ password, fullName, phone, role = "user" }: RegisterInput) {
  
  const { data: userData, error } = await supabaseAdmin.auth.admin.createUser({
    
    password,
    
  })

  if (error) throw new Error(error.message)
  if (!userData.user) throw new Error("No se pudo crear el usuario")

  
  await db.insert(profiles).values({
    id: randomUUID(),
    fullName,
    phone: phone ,
    role
  })

  return { id: userData.user.id, phone: userData.user.phone }
}

interface LoginInput {
  phone: string
  password: string
}

export async function loginUser({ phone, password }: LoginInput) {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    phone,
    password
  })

  if (error) throw new Error(error.message)

  // data.session contiene access_token y refresh_token
  return {
    user: data.user,
    session: data.session
  }
}
