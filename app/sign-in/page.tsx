import AuthForm from "@/app/auth/auth-form";

type SignInPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const next =
    typeof params.next === "string" && params.next.startsWith("/") ? params.next : "/app";

  return <AuthForm mode="sign-in" nextPath={next} />;
}
