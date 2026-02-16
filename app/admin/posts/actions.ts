"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isUniqueViolation(message: string) {
  return message.toLowerCase().includes("duplicate key");
}

export async function createPostAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/admin/posts/new");
  }

  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const content = String(formData.get("content_markdown") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title) {
    redirect("/admin/posts/new?error=Title%20is%20required");
  }

  const slug = slugify(rawSlug || title);
  if (!slug) {
    redirect("/admin/posts/new?error=Could%20not%20generate%20a%20valid%20slug");
  }

  const { error } = await supabase.from("p1_posts").insert({
    user_id: user.id,
    title,
    slug,
    content_markdown: content,
    published,
  });

  if (error) {
    const message = isUniqueViolation(error.message)
      ? "Slug%20already%20exists.%20Use%20a%20different%20slug."
      : encodeURIComponent(error.message);
    redirect(`/admin/posts/new?error=${message}`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts?status=created");
}

export async function updatePostAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/admin/posts");
  }

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const content = String(formData.get("content_markdown") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!id || !title) {
    redirect(`/admin/posts/${id}/edit?error=Missing%20required%20fields`);
  }

  const slug = slugify(rawSlug || title);
  if (!slug) {
    redirect(`/admin/posts/${id}/edit?error=Could%20not%20generate%20a%20valid%20slug`);
  }

  const { error } = await supabase
    .from("p1_posts")
    .update({
      title,
      slug,
      content_markdown: content,
      published,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    const message = isUniqueViolation(error.message)
      ? "Slug%20already%20exists.%20Use%20a%20different%20slug."
      : encodeURIComponent(error.message);
    redirect(`/admin/posts/${id}/edit?error=${message}`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${id}/edit?status=saved`);
}

export async function deletePostAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/admin/posts");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin/posts?error=Missing%20post%20id");
  }

  const { error } = await supabase.from("p1_posts").delete().eq("id", id).eq("user_id", user.id);
  if (error) {
    redirect(`/admin/posts?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts?status=deleted");
}
