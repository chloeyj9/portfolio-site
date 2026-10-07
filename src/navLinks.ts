import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config';

export type Page = 'home' | 'sketchbook' | 'about' | 'project';
export type NavLink = { key: string; label: string; href: string };

// The four site links, shared by the sidebar and the footer.
export async function navLinks(current: Page) {
  const nav = await createReader(process.cwd(), keystaticConfig).singletons.navigation.readOrThrow();
  const onHome = current === 'home';
  return {
    nav,
    links: [
      { key: 'home', label: nav.homeLabel, href: onHome ? '#top' : '/' },
      { key: 'projects', label: nav.projectsLabel, href: onHome ? '#projects' : '/#projects' },
      { key: 'sketchbook', label: nav.sketchbookLabel, href: '/sketchbook' },
      { key: 'about', label: nav.aboutLabel, href: '/about' },
    ],
  };
}
