import type { Config } from "drizzle-kit"

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./supabase/migrations",
  driver: "postgres-js",
  dbCredentials: process.env.DATABASE_URL!,
} as unknown as Config
