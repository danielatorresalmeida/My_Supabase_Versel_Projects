"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setError("No active session. Please open the recovery link again.");
      }
      setLoading(false);
    })();
  }, [supabase]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage("Password updated. Redirecting...");
    setTimeout(() => router.push("/sign-in"), 800);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Set your password</h1>
      <p className="mt-2 text-sm opacity-80">Enter your new password to finish account recovery.</p>

      {loading ? (
        <p className="mt-6">Loading...</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              className="w-full rounded border px-3 py-2"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm" htmlFor="confirm-password">
              Confirm password
            </label>
            <input
              id="confirm-password"
              className="w-full rounded border px-3 py-2"
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button
            className="rounded bg-black px-4 py-2 text-white"
            type="submit"
            disabled={loading}
          >
            Save password
          </button>
        </form>
      )}
    </main>
  );
}
