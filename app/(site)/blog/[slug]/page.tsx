import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { excerptMarkdown, renderMarkdown } from "@/src/lib/markdown";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getPublishedPostBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data: post, error } = await supabase
    .from("p1_posts")
    .select("title, content_markdown, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !post) {
    return null;
  }

  return post;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found | Blog",
      description: "The requested blog post is not available.",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: excerptMarkdown(post.content_markdown, 155),
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <p className="text-xs opacity-70">{new Date(post.created_at).toLocaleDateString()}</p>
      <div className="space-y-4 text-sm">
        {renderMarkdown(post.content_markdown, `post-${slug}`)}
      </div>
    </article>
  );
}
