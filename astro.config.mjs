import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jonathanbobrow.com',
  build: {
    // Inline all CSS into the page: removes the render-blocking stylesheet
    // request for better FCP/LCP.
    inlineStylesheets: 'always',
  },
});
