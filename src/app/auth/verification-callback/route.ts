import { supabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = "/auth/confirmed-email";

  if (code) {
    const supabase = await supabaseClient();

    // This exchanges the "code" for an active user session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    if (error.code === "otp_expired") {
      return NextResponse.redirect(`${origin}/auth/otp-expired`);
    }
  }

  // If something went wrong, send them to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
