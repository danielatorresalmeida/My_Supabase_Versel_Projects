import Link from "next/link";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export default async function BlogPage() {
  const supabase = await createSupabaseServerClient();
  const { data: posts, error } = await supabase
    .from("p1_posts")
    .select("id, title, slug, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <p className="text-sm opacity-80">Published posts from Project 1 and onward.</p>

      {error ? (
        <p className="text-sm text-red-600">Failed to load posts: {error.message}</p>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <article className="space-y-1 rounded border p-4" key={post.id}>
              <h2 className="text-lg font-medium">{post.title}</h2>
              <p className="text-xs opacity-70">{new Date(post.created_at).toLocaleDateString()}</p>
              <Link className="text-sm underline" href={`/blog/${post.slug}`}>
                Read post
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm opacity-80">No published posts yet.</p>
      )}
    </main>
  );
}
