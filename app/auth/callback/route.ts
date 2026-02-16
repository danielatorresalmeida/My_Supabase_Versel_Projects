import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const typeParam = url.searchParams.get("type");
  const type = typeParam as EmailOtpType | null;
  const nextParam = url.searchParams.get("next");
  const defaultNext = type === "recovery" ? "/reset-password/update" : "/";
  const next = nextParam && nextParam.startsWith("/") ? nextParam : defaultNext;

  const supabase = await createSupabaseServerClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/error?reason=${encodeURIComponent(error.message)}`, url.origin)
      );
    }

    return NextResponse.redirect(new URL(next, url.origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL(next, url.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    if (error.message.toLowerCase().includes("pkce code verifier not found")) {
      return NextResponse.redirect(
        new URL(
          "/auth/error?reason=This recovery link was opened in a different browser session. Request a new reset link and open it in the same browser.",
          url.origin
        )
      );
    }

    return NextResponse.redirect(
      new URL(`/auth/error?reason=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
