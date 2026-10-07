import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

// The editing dashboard (/keystatic) needs a server adapter.
// Keep it for `npm run dev`; production builds (including Vercel) are static.
const withDashboard =
  process.env.NODE_ENV !== 'production' &&
  !process.env.STATIC_ONLY &&
  !process.env.SKIP_KEYSTATIC;

export default defineConfig({
  integrations: [react(), markdoc(), ...(withDashboard ? [keystatic()] : [])],
  vite: { plugins: [tailwindcss()] },
});
