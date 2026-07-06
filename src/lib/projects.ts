import { getCollection, type CollectionEntry } from 'astro:content';
import MarkdownIt from 'markdown-it';

export type Project = CollectionEntry<'projects'>;

// Same markdown engine and options as Eleventy's default, so project bodies
// render identically to the 11ty site.
const md = new MarkdownIt({ html: true });

export function renderMarkdown(body: string | undefined): string {
  return md.render(body ?? '');
}

// All projects sorted by `order`; ties broken by source filename, matching
// the 11ty collection's input-path ordering. (entry.id can't be used here:
// the glob loader replaces it with the frontmatter `slug`.)
export async function allProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort(
    (a, b) =>
      (a.data.order || 0) - (b.data.order || 0) ||
      (a.filePath ?? '').localeCompare(b.filePath ?? '')
  );
}

export async function featuredProjects(): Promise<Project[]> {
  return (await allProjects()).filter((p) => p.data.featured);
}

// Deduplicated sketch names used across the given projects.
export function sketchSlugs(projects: Project[]): string[] {
  return [...new Set(projects.filter((p) => p.data.heroSketch).map((p) => p.data.heroSketch!))];
}
