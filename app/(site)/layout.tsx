import Link from "next/link";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link className="text-lg font-semibold" href="/">
            Daniela Torres
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/about">About</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/sign-in">Sign in</Link>
          </div>
        </nav>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
