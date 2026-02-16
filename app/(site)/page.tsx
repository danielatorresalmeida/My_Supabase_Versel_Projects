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

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : null;
  const tokenHash = typeof params.token_hash === "string" ? params.token_hash : null;

  if (code || tokenHash) {
    const callbackParams = new URLSearchParams();
    if (code) {
      callbackParams.set("code", code);
    }

    if (tokenHash) {
      callbackParams.set("token_hash", tokenHash);
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
    <main className="space-y-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-widest opacity-70">Personal Portfolio + Blog</p>
        <h1 className="text-4xl font-bold">
          Building practical products with Next.js and Supabase.
        </h1>
        <p className="max-w-2xl text-sm opacity-80">
          This site is Project 1 from your roadmap. It includes public pages, a blog, and protected
          admin management routes for posts.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link className="rounded border p-4 text-sm hover:bg-black/5" href="/projects">
          View projects
        </Link>
        <Link className="rounded border p-4 text-sm hover:bg-black/5" href="/blog">
          Read blog posts
        </Link>
        <Link className="rounded border p-4 text-sm hover:bg-black/5" href="/about">
          About
        </Link>
        <Link className="rounded border p-4 text-sm hover:bg-black/5" href="/contact">
          Contact
        </Link>
      </section>

      <section className="space-y-2 rounded border p-4">
        {user ? (
          <>
            <p className="text-sm">Signed in as {user.email}</p>
            <div className="flex flex-wrap gap-2">
              <Link className="rounded border px-3 py-2 text-sm" href="/app">
                Open app area
              </Link>
              <Link className="rounded border px-3 py-2 text-sm" href="/admin">
                Open admin
              </Link>
              <form action="/auth/signout" method="post">
                <button className="rounded bg-black px-3 py-2 text-sm text-white" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Link className="rounded bg-black px-3 py-2 text-sm text-white" href="/sign-in">
              Sign in
            </Link>
            <Link className="rounded border px-3 py-2 text-sm" href="/sign-up">
              Create account
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
