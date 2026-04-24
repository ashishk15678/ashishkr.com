import fs from "fs";
import path from "path";
import { PROJECTS } from "@/lib/constants/projects";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { markdownToHtml } from "@/lib/markdown-to-html";

// Generate static routes at build time for all projects with a slug
export async function generateStaticParams() {
  return PROJECTS.filter((p) => p.slug).map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectCaseStudy(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const project = PROJECTS.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  let contentHtml = "";
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "projects",
      `${params.slug}.md`,
    );
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      contentHtml = await markdownToHtml(fileContents);
    }
  } catch (e) {
    console.error("Error reading case study markdown:", e);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <article className="container mx-auto px-4 sm:px-6 md:px-12 py-24 md:py-32 max-w-4xl">
        <header className="mb-12 md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-mono tracking-widest text-muted-foreground uppercase">
            <span>Project {project.number}</span>
            <span className="w-8 h-px bg-border"></span>
            <span>Case Study</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="px-3 py-1 rounded-full border border-border bg-muted/30">
              {project.year}
              {project.endYear ? ` — ${project.endYear}` : ""}
            </span>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline underline-offset-4"
              >
                GitHub Repository
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline underline-offset-4"
              >
                Live Demo
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border border-border/60 rounded-full text-xs font-medium tracking-wider bg-background/50 backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <section className="space-y-12 md:space-y-16">
          {contentHtml ? (
            <div
              className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-semibold mb-4 border-b border-border/50 pb-3">
                  Overview
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {project.longDescription || project.description}
                </p>
              </div>

              {project.architecture && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 border-b border-border/50 pb-3">
                    Architecture & Stack
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.architecture}
                  </p>
                </div>
              )}
            </>
          )}

          {project.graphs && project.graphs.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 border-b border-border/50 pb-3">
                Key Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.graphs.map((graph) => (
                  <div
                    key={graph.label}
                    className="p-6 border border-border/60 rounded-2xl bg-muted/10 flex flex-col items-center justify-center text-center"
                  >
                    <div className="text-4xl font-bold mb-2 tracking-tighter">
                      {graph.value}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                      {graph.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.images && project.images.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 border-b border-border/50 pb-3">
                Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-border/60 bg-muted/10 group"
                  >
                    <img
                      src={img}
                      alt={`${project.title} screenshot ${i + 1}`}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </article>
    </main>
  );
}
