/** Public site identity (override via Vite env in production builds). */
const trimTrailingSlashes = (s) => String(s || '').replace(/\/+$/, '');

export const SITE_ORIGIN = trimTrailingSlashes(
  import.meta.env.VITE_SITE_ORIGIN || 'https://smarteprinting.com'
);

export const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Smart ePrinting';

export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@smarteprinting.com';

/** Absolute URL for a path starting with `/` */
export function siteUrl(path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (p === '/') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${p}`;
}
