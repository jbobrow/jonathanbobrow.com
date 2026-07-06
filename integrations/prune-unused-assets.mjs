import { readdir, readFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

// Importing images via import.meta.glob (for getImage optimization) makes
// Vite emit a hashed copy of every original into _astro even when only the
// WebP variants are used. Those copies are never referenced by any page —
// this hook deletes any _astro image file that no built HTML/CSS mentions,
// keeping ~90MB of duplicates out of the deploy artifact.
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

export default function pruneUnusedAssets() {
  return {
    name: 'prune-unused-assets',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = new URL(dir).pathname;
        const astroDir = join(root, '_astro');

        const referenced = new Set();
        const collect = async (d) => {
          for (const entry of await readdir(d, { withFileTypes: true })) {
            const p = join(d, entry.name);
            if (entry.isDirectory()) await collect(p);
            else if (/\.(html|css|js)$/.test(entry.name)) {
              const text = await readFile(p, 'utf8');
              for (const m of text.matchAll(/\/_astro\/[^"'\s),]+/g)) {
                referenced.add(decodeURI(m[0].replace('/_astro/', '')));
              }
            }
          }
        };
        await collect(root);

        let pruned = 0;
        for (const file of await readdir(astroDir)) {
          if (IMAGE_EXT.test(file) && !referenced.has(file)) {
            await unlink(join(astroDir, file));
            pruned++;
          }
        }
        logger.info(`pruned ${pruned} unreferenced _astro image(s)`);
      },
    },
  };
}
