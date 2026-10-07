import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

// The editing dashboard (/keystatic) runs during `npm run dev`.
// Set STATIC_ONLY=1 to build a plain static site without it.
const withDashboard = !process.env.STATIC_ONLY;

export default defineConfig({
  integrations: [react(), markdoc(), ...(withDashboard ? [keystatic()] : [])],
  vite: { plugins: [tailwindcss()] },
});
