import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: post, error } = await supabase
    .from("p1_posts")
    .select("title, content_markdown, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <p className="text-xs opacity-70">{new Date(post.created_at).toLocaleDateString()}</p>
      <div className="whitespace-pre-wrap text-sm leading-7">{post.content_markdown}</div>
    </article>
  );
}
