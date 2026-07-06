import { getCollection, type CollectionEntry } from 'astro:content';
import MarkdownIt from 'markdown-it';
import { bodyImage } from './images';

export type Project = CollectionEntry<'projects'>;

// Same markdown engine and options as Eleventy's default, so project bodies
// render identically to the 11ty site.
const md = new MarkdownIt({ html: true });

// Body images live inside collapsed detail panels, so they must never load
// eagerly: without loading="lazy" the browser fetches every detail image on
// page load even though the panels are hidden (this alone was ~16MB on the
// featured page). Non-GIF images are also swapped for capped-width WebP
// srcset variants; anything the pipeline can't resolve keeps its original
// src and just gets lazy-loading attributes.
async function optimizeBodyImages(html: string): Promise<string> {
  const tags = [...new Set(html.match(/<img [^>]*>/g) ?? [])];
  const replacements = new Map<string, string>();

  for (const tag of tags) {
    const srcMatch = tag.match(/src="([^"]*)"/);
    if (!srcMatch) continue;
    const src = decodeURI(srcMatch[1]);
    const opt = src.startsWith('/images/') ? await bodyImage(src) : null;

    let out = tag;
    if (opt) {
      out = out.replace(
        srcMatch[0],
        `src="${opt.src}" srcset="${opt.srcset}" sizes="${opt.sizes}" width="${opt.width}" height="${opt.height}"`
      );
    }
    if (!/loading=/.test(out)) out = out.replace(/>$/, ' loading="lazy" decoding="async">');
    replacements.set(tag, out);
  }

  for (const [from, to] of replacements) {
    html = html.replaceAll(from, to);
  }
  return html;
}

export async function renderMarkdown(body: string | undefined): Promise<string> {
  return optimizeBodyImages(md.render(body ?? ''));
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
