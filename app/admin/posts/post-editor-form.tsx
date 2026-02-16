"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { renderMarkdown } from "@/src/lib/markdown";

type PostEditorDefaults = {
  id?: string;
  title?: string;
  slug?: string;
  contentMarkdown?: string;
  published?: boolean;
};

type PostEditorFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  cancelHref: string;
  submitLabel: string;
  defaults?: PostEditorDefaults;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostEditorForm({
  action,
  cancelHref,
  submitLabel,
  defaults,
}: PostEditorFormProps) {
  const [title, setTitle] = useState(defaults?.title ?? "");
  const [slug, setSlug] = useState(defaults?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(defaults?.slug));
  const [contentMarkdown, setContentMarkdown] = useState(defaults?.contentMarkdown ?? "");
  const [published, setPublished] = useState(Boolean(defaults?.published));

  const renderedPreview = useMemo(
    () => renderMarkdown(contentMarkdown, "post-editor-preview"),
    [contentMarkdown]
  );

  function onTitleChange(nextTitle: string) {
    setTitle(nextTitle);
    if (!slugEdited) {
      setSlug(slugify(nextTitle));
    }
  }

  function onSlugChange(nextSlug: string) {
    setSlugEdited(true);
    setSlug(nextSlug);
  }

  function generateSlugFromTitle() {
    setSlugEdited(true);
    setSlug(slugify(title));
  }

  return (
    <form action={action} className="space-y-6">
      {defaults?.id && <input name="id" type="hidden" value={defaults.id} />}

      <div className="space-y-2">
        <label className="text-sm" htmlFor="title">
          Title
        </label>
        <input
          className="w-full rounded border bg-transparent px-3 py-2"
          id="title"
          name="title"
          onChange={(event) => onTitleChange(event.target.value)}
          required
          type="text"
          value={title}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm" htmlFor="slug">
          Slug
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            className="min-w-0 flex-1 rounded border bg-transparent px-3 py-2"
            id="slug"
            name="slug"
            onChange={(event) => onSlugChange(event.target.value)}
            placeholder="my-first-post"
            type="text"
            value={slug}
          />
          <button
            className="rounded border px-3 py-2 text-sm"
            onClick={generateSlugFromTitle}
            type="button"
          >
            Generate from title
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm" htmlFor="content_markdown">
            Markdown content
          </label>
          <textarea
            className="min-h-80 w-full rounded border bg-transparent px-3 py-2 font-mono text-sm"
            id="content_markdown"
            name="content_markdown"
            onChange={(event) => setContentMarkdown(event.target.value)}
            value={contentMarkdown}
          />
          <p className="text-xs opacity-70">
            Supports headings, links, bullet lists, block quotes, and fenced code blocks.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm">Preview</p>
          <div className="min-h-80 space-y-3 rounded border p-3">
            {contentMarkdown.trim() ? (
              renderedPreview
            ) : (
              <p className="text-sm opacity-70">Preview updates as you type markdown.</p>
            )}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          checked={published}
          name="published"
          onChange={() => setPublished((v) => !v)}
          type="checkbox"
        />
        Publish now
      </label>

      <div className="flex gap-2">
        <button className="rounded bg-black px-4 py-2 text-sm text-white" type="submit">
          {submitLabel}
        </button>
        <Link className="rounded border px-4 py-2 text-sm" href={cancelHref}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
