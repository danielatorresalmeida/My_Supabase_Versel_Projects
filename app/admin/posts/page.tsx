import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { deletePostAction } from "./actions";

type AdminPostsPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

export default async function AdminPostsPage({ searchParams }: AdminPostsPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in?next=/admin/posts");
  }

  const { data: posts, error } = await supabase
    .from("p1_posts")
    .select("id, title, slug, published, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Posts</h1>
        <Link className="rounded bg-black px-3 py-2 text-sm text-white" href="/admin/posts/new">
          New post
        </Link>
      </div>

      {params.status && (
        <p className="rounded border border-green-700/50 bg-green-600/10 p-3 text-sm text-green-200">
          {params.status === "created" ? "Post created." : "Post deleted."}
        </p>
      )}
      {params.error && (
        <p className="rounded border border-red-700/50 bg-red-600/10 p-3 text-sm text-red-200">
          {params.error}
        </p>
      )}
      {error && <p className="text-sm text-red-600">Failed to load posts: {error.message}</p>}

      {posts && posts.length > 0 ? (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li className="rounded border p-4" key={post.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium">{post.title}</h2>
                  <p className="text-xs opacity-70">
                    /blog/{post.slug} ·{" "}
                    {post.published ? (
                      <span className="text-green-300">published</span>
                    ) : (
                      <span className="text-amber-300">draft</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    className="rounded border px-3 py-2 text-sm"
                    href={`/admin/posts/${post.id}/edit`}
                  >
                    Edit
                  </Link>
                  <form action={deletePostAction}>
                    <input name="id" type="hidden" value={post.id} />
                    <button className="rounded border px-3 py-2 text-sm text-red-300" type="submit">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm opacity-80">No posts yet. Create your first post.</p>
      )}
    </main>
  );
}
