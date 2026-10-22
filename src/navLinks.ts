import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config';

export type Page = 'home' | 'studio' | 'about' | 'project';
export type NavLink = { key: string; label: string; href?: string };

// The three site links, shared by the header and the footer. The logo links home.
export async function navLinks(current: Page) {
  const nav = await createReader(process.cwd(), keystaticConfig).singletons.navigation.readOrThrow();
  const onHome = current === 'home';
  return {
    nav,
    links: [
      { key: 'work', label: nav.projectsLabel, href: onHome ? '#work' : '/#work' },
      { key: 'studio', label: nav.sketchbookLabel, href: '/studio' },
      // About isn't linked for now; it shows in the menu but goes nowhere.
      { key: 'about', label: nav.aboutLabel },
    ] as NavLink[],
  };
}
