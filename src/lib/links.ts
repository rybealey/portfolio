// Links that leave the site open in a new tab, so a visitor keeps their
// place here. noopener stops the new page from reaching back into this one.
import { site } from '../data/site';

const home = new URL(site.url).host;

/** An http(s) link to another site. Mail links and paths stay in the tab. */
export function isExternal(href: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return new URL(href).host !== home;
  } catch {
    return false;
  }
}

/** Spread onto an <a>: target and rel for external links, nothing otherwise. */
export const externalAttrs = (href: string) =>
  isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
