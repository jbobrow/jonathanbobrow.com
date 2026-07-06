import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

// Frontmatter hero paths (e.g. "/images/projects/blinks/hero.jpg") point at
// files in public/, so the original URLs keep working for markdown bodies and
// direct links. This map lets us also run those same files through Astro's
// image service to emit responsive WebP variants for hero and thumbnail use.
// GIFs are excluded so animated heroes pass through untouched.
const sources = import.meta.glob<{ default: ImageMetadata }>(
  '/public/images/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}',
  { eager: true }
);

export interface ResponsiveImage {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
}

async function variants(
  publicPath: string | undefined,
  widths: number[],
  sizes: string
): Promise<ResponsiveImage | null> {
  if (!publicPath) return null;
  const mod = sources['/public' + publicPath];
  if (!mod) return null;
  const meta = mod.default;
  const candidates = widths.filter((w) => w <= meta.width);
  if (!candidates.includes(meta.width) && candidates.length < widths.length) {
    candidates.push(meta.width);
  }
  if (candidates.length === 0) candidates.push(meta.width);
  const image = await getImage({
    src: meta,
    width: Math.max(...candidates),
    widths: candidates,
    format: 'webp',
  });
  return {
    src: image.src,
    srcset: image.srcSet.attribute,
    sizes,
    width: image.attributes.width,
    height: image.attributes.height,
  };
}

// Featured-page hero: fills 50vw on desktop (2-col grid), 100vw on mobile.
export function heroImage(publicPath: string | undefined) {
  return variants(publicPath, [768, 1280, 1920, 2560], '(max-width: 768px) 100vw, 50vw');
}

// Archive thumbnail: grid cells are ~220-350px wide.
export function thumbImage(publicPath: string | undefined) {
  return variants(publicPath, [320, 640, 960], '(max-width: 768px) 50vw, 320px');
}

// Markdown-body image: project descriptions are capped at 44rem (704px).
export function bodyImage(publicPath: string | undefined) {
  return variants(publicPath, [640, 1280, 1600], '(max-width: 768px) 100vw, 704px');
}
