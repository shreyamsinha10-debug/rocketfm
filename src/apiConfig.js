// Same-origin in production (Vercel proxy). Override with VITE_API_BASE_URL for local direct access.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api/v1';
