"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";

function formatResetError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("rate limit")) {
    return "Too many reset requests. This project currently allows about 2 auth emails per hour. Please wait and try again.";
  }

  return message;
}

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        "/reset-password/update"
      )}`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (resetError) {
        setError(formatResetError(resetError.message));
        return;
      }

      setMessage("Password reset email sent. Check your inbox.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      <p className="text-sm opacity-80">
        Enter your email and we will send you a password reset link.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="w-full rounded border px-3 py-2"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Send reset link"}
        </button>

        <p className="text-xs opacity-70">
          Note: default Supabase email is rate-limited. If you hit limits, wait before retrying.
        </p>
      </form>

      <Link className="inline-block text-sm underline" href="/sign-in">
        Back to sign in
      </Link>
    </main>
  );
}
