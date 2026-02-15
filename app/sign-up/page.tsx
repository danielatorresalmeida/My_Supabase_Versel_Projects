import AuthForm from "@/app/auth/auth-form";

type SignUpPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const next =
    typeof params.next === "string" && params.next.startsWith("/")
      ? params.next
      : "/app";

  return <AuthForm mode="sign-up" nextPath={next} />;
}
