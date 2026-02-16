import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { updatePostAction } from "../../actions";
import PostEditorForm from "../../post-editor-form";

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

      <PostEditorForm
        action={updatePostAction}
        cancelHref="/admin/posts"
        defaults={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          contentMarkdown: post.content_markdown,
          published: post.published,
        }}
        submitLabel="Save changes"
      />
    </main>
  );
}
