import { defineConfig } from 'astro/config';
import pruneUnusedAssets from './integrations/prune-unused-assets.mjs';

export default defineConfig({
  site: 'https://jonathanbobrow.com',
  integrations: [pruneUnusedAssets()],
  build: {
    // Inline all CSS into the page: removes the render-blocking stylesheet
    // request for better FCP/LCP.
    inlineStylesheets: 'always',
  },
});
