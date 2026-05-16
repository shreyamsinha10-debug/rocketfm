// Same-origin in production (Vercel proxy). Override with VITE_API_BASE_URL for local direct access.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api/v1';

/** Rewrite absolute backend URLs to same-origin paths (fixes HTTPS mixed content). */
export function proxyAssetUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const marker = '/api/v1/';
  const i = url.indexOf(marker);
  if (i !== -1) return url.slice(i);
  return url;
}
