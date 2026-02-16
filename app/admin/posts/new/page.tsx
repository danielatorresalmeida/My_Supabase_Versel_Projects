import Link from "next/link";
import { createPostAction } from "../actions";

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

      <form action={createPostAction} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm" htmlFor="title">
            Title
          </label>
          <input
            className="w-full rounded border bg-transparent px-3 py-2"
            id="title"
            name="title"
            required
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm" htmlFor="slug">
            Slug (optional)
          </label>
          <input
            className="w-full rounded border bg-transparent px-3 py-2"
            id="slug"
            name="slug"
            placeholder="my-first-post"
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm" htmlFor="content_markdown">
            Markdown content
          </label>
          <textarea
            className="min-h-64 w-full rounded border bg-transparent px-3 py-2"
            id="content_markdown"
            name="content_markdown"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" />
          Publish now
        </label>

        <div className="flex gap-2">
          <button className="rounded bg-black px-4 py-2 text-sm text-white" type="submit">
            Create post
          </button>
          <Link className="rounded border px-4 py-2 text-sm" href="/admin/posts">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
