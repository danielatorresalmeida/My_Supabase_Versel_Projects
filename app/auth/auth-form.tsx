"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
  nextPath: string;
};

export default function AuthForm({ mode, nextPath }: AuthFormProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const isSignUp = mode === "sign-up";
  const switchHref = `${
    isSignUp ? "/sign-in" : "/sign-up"
  }?next=${encodeURIComponent(nextPath)}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          nextPath
        )}`;
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.session) {
          router.replace(nextPath);
          router.refresh();
          return;
        }

        setMessage("Account created. Check your inbox to confirm your email.");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{isSignUp ? "Create account" : "Sign in"}</h1>
      <p className="text-sm opacity-80">
        {isSignUp ? "Create your account to continue." : "Sign in to continue."}
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

        <div className="space-y-2">
          <label className="text-sm" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="w-full rounded border px-3 py-2"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
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
          {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      {!isSignUp && (
        <Link className="inline-block text-sm underline" href="/reset-password">
          Forgot your password?
        </Link>
      )}

      <Link className="inline-block text-sm underline" href={switchHref}>
        {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
      </Link>

      <Link className="inline-block text-sm underline" href="/">
        Back to home
      </Link>
    </main>
  );
}
