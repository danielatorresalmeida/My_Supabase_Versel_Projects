import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-sm opacity-80">Admin area for managing content across projects.</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link className="rounded border p-4 text-sm hover:bg-black/5" href="/admin/posts">
          Manage blog posts
        </Link>
        <div className="rounded border p-4 text-sm opacity-70">
          Product admin will be added in Project 5.
        </div>
      </div>
    </main>
  );
}
