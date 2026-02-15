import { Result } from "@/features/shared/Result";
import { db, TransactionType } from "../db";
import { supabaseClient } from "@/lib/supabase/server";
import { sql } from "drizzle-orm";

export default function decorateWithRLS<T extends object>(
  factory: (database: TransactionType) => T
): T {
  // Use a Proxy to wrap all methods of the controller automatically
  return new Proxy({} as T, {
    get(_, prop) {
      return async (...args: unknown[]) => {
        try {
          const supabase = await supabaseClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          return await db.transaction(async (tx) => {
            if (user) {
              const claims = JSON.stringify({
                sub: user.id,
                role: user.app_metadata?.role ?? "authenticated",
              });
              // 1. Set the RLS session context
              await tx.execute(
                sql`SELECT set_config('request.jwt.claims', ${claims}, true)`
              );
            }

            // 2. Instantiate the controller with the transactional client
            const controller = factory(tx) as {
              [key: string | symbol]: unknown;
            };
            const method = controller[prop];

            if (typeof method !== "function") return method;

            // 3. Execute the logic
            return await method.apply(controller, args);
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return Result.err({
              code: error.name,
              message: error.message,
            });
          }

          return Result.err({
            code: "UNKNOWN_ERROR",
            message: "Error desconocido",
          });
        }
      };
    },
  });
}

export async function withRLS<T>(
  callback: (tx: unknown) => Promise<T>
): Promise<T> {
  const supabase = await supabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return await db.transaction(async (tx) => {
    if (user) {
      // Set the session variable that our public.get_my_id() function reads
      // 'request.jwt.claims' is where Supabase usually stores the JWT data
      const jwtClaims = JSON.stringify({
        sub: user.id,
        role: user.app_metadata?.role ?? "authenticated",
      });
      await tx.execute(
        sql`SELECT set_config('request.jwt.claims', ${jwtClaims}, true)`
      );
    }

    return await callback(tx);
  });
}
