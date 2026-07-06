import type { APIContext } from 'astro';
import { allProjects } from '../../../lib/projects';

// Deep-link stubs for /work/<slug>/: redirect to the featured page or the
// archive with a flag that opens the project (same stubs the 11ty site
// generated).
export async function getStaticPaths() {
  const projects = await allProjects();
  return projects.map((project) => ({
    params: { slug: project.data.slug },
    props: { featured: project.data.featured },
  }));
}

export function GET({ params, props }: APIContext<{ featured: boolean }>) {
  const target = props.featured ? '/' : '/archive/';
  const html = `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<script>
  sessionStorage.setItem('directEntry', '${params.slug}');
  window.location.replace('${target}');
</script>
<meta http-equiv="refresh" content="0;url=${target}">
</head></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
