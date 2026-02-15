import Link from "next/link";

type AuthErrorPageProps = {
  searchParams: Promise<{
    reason?: string;
  }>;
};

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams;
  const reason =
    typeof params.reason === "string" ? params.reason : "Unknown authentication error.";

  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Authentication Error</h1>
      <p className="text-sm text-red-600">{reason}</p>
      <Link className="inline-block text-sm underline" href="/auth">
        Go to auth page
      </Link>
    </main>
  );
}
