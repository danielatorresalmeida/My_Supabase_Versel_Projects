import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_EXACT_ROUTES = new Set([
  "/shop/cart",
  "/shop/checkout",
  "/shop/orders",
]);

function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin");
}

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/app") ||
    isAdminPath(pathname) ||
    PROTECTED_EXACT_ROUTES.has(pathname)
  );
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && isProtectedPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set(
      "next",
      pathname + request.nextUrl.search
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAdminPath(pathname)) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (error || profile?.role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/app";
      redirectUrl.searchParams.set("error", "admin_required");
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/app/:path*",
    "/admin/:path*",
    "/shop/cart",
    "/shop/checkout",
    "/shop/orders",
  ],
};
