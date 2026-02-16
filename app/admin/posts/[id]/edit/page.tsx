import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { updatePostAction } from "../../actions";

type EditPostPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

export default async function EditPostPage({ params, searchParams }: EditPostPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/sign-in?next=/admin/posts/${id}/edit`);
  }

  const { data: post, error } = await supabase
    .from("p1_posts")
    .select("id, title, slug, content_markdown, published")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Edit Post</h1>
        <p className="text-sm opacity-80">Update content, slug, and publish status.</p>
      </div>

      {query.status && (
        <p className="rounded border border-green-700/50 bg-green-600/10 p-3 text-sm text-green-200">
          Post saved.
        </p>
      )}
      {query.error && (
        <p className="rounded border border-red-700/50 bg-red-600/10 p-3 text-sm text-red-200">
          {query.error}
        </p>
      )}

      <form action={updatePostAction} className="space-y-4">
        <input name="id" type="hidden" value={post.id} />

        <div className="space-y-2">
          <label className="text-sm" htmlFor="title">
            Title
          </label>
          <input
            className="w-full rounded border bg-transparent px-3 py-2"
            defaultValue={post.title}
            id="title"
            name="title"
            required
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm" htmlFor="slug">
            Slug
          </label>
          <input
            className="w-full rounded border bg-transparent px-3 py-2"
            defaultValue={post.slug}
            id="slug"
            name="slug"
            required
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm" htmlFor="content_markdown">
            Markdown content
          </label>
          <textarea
            className="min-h-64 w-full rounded border bg-transparent px-3 py-2"
            defaultValue={post.content_markdown}
            id="content_markdown"
            name="content_markdown"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input defaultChecked={post.published} name="published" type="checkbox" />
          Published
        </label>

        <div className="flex gap-2">
          <button className="rounded bg-black px-4 py-2 text-sm text-white" type="submit">
            Save changes
          </button>
          <Link className="rounded border px-4 py-2 text-sm" href="/admin/posts">
            Back
          </Link>
        </div>
      </form>
    </main>
  );
}
