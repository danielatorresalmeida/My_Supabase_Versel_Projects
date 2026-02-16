import { createPostAction } from "../actions";
import PostEditorForm from "../post-editor-form";

type NewPostPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">New Post</h1>
        <p className="text-sm opacity-80">Create a new blog post for `/blog/[slug]`.</p>
      </div>

      {params.error && (
        <p className="rounded border border-red-700/50 bg-red-600/10 p-3 text-sm text-red-200">
          {params.error}
        </p>
      )}

      <PostEditorForm
        action={createPostAction}
        cancelHref="/admin/posts"
        submitLabel="Create post"
      />
    </main>
  );
}
