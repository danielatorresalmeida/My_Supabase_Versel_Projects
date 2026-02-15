import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/auth", url.origin));
}
