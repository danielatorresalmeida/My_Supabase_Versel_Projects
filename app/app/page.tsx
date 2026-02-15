import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export default async function AppPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/app");
  }

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">App Area</h1>
      <p className="text-sm opacity-80">You are logged in as {user.email}</p>

      <form action="/auth/signout" method="post">
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">
          Sign out
        </button>
      </form>

      <Link className="inline-block text-sm underline" href="/">
        Back to home
      </Link>
    </main>
  );
}
