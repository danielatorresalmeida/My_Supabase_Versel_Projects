import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

type HomePageProps = {
  searchParams: Promise<{
    code?: string;
    token_hash?: string;
    type?: string;
    next?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : null;

  if (code) {
    const callbackParams = new URLSearchParams();
    callbackParams.set("code", code);

    if (typeof params.token_hash === "string") {
      callbackParams.set("token_hash", params.token_hash);
    }
    if (typeof params.type === "string") {
      callbackParams.set("type", params.type);
    }

    const next =
      typeof params.next === "string" && params.next.startsWith("/")
        ? params.next
        : "/reset-password/update";
    callbackParams.set("next", next);

    redirect(`/auth/callback?${callbackParams.toString()}`);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Foundation Check</h1>

      {user ? (
        <>
          <p className="text-sm opacity-80">Signed in as {user.email}</p>
          <div className="flex gap-3">
            <Link className="rounded border px-3 py-2 text-sm" href="/app">
              Go to /app
            </Link>
            <form action="/auth/signout" method="post">
              <button className="rounded bg-black px-3 py-2 text-sm text-white" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm opacity-80">No active session.</p>
          <Link className="inline-block rounded bg-black px-3 py-2 text-sm text-white" href="/sign-in">
            Go to /sign-in
          </Link>
        </>
      )}
    </main>
  );
}
