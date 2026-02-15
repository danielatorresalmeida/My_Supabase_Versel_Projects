import Link from "next/link";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export default async function Home() {
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
          <Link className="inline-block rounded bg-black px-3 py-2 text-sm text-white" href="/auth">
            Go to /auth
          </Link>
        </>
      )}
    </main>
  );
}
