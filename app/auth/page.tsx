import { redirect } from "next/navigation";

type AuthPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const next =
    typeof params.next === "string" && params.next.startsWith("/") ? params.next : "/app";

  redirect(`/sign-in?next=${encodeURIComponent(next)}`);
}
