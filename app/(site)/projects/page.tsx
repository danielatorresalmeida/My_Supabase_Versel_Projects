import Link from "next/link";

const PROJECTS = [
  {
    title: "Project 1 - Portfolio + Blog",
    href: "/blog",
    status: "In progress",
    description: "Public portfolio and blog with protected admin CRUD.",
  },
  {
    title: "Project 2 - Weather Dashboard",
    href: "/weather",
    status: "Planned",
    description: "City search, current weather, 7-day forecast, saved locations.",
  },
  {
    title: "Project 3 - News Aggregator",
    href: "/news",
    status: "Planned",
    description: "Free data source, category filters, bookmarks per user.",
  },
];

export default function ProjectsPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {PROJECTS.map((project) => (
          <article className="space-y-2 rounded border p-4" key={project.title}>
            <p className="text-xs uppercase tracking-widest opacity-70">{project.status}</p>
            <h2 className="text-lg font-medium">{project.title}</h2>
            <p className="text-sm opacity-80">{project.description}</p>
            <Link className="inline-block text-sm underline" href={project.href}>
              Open
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
