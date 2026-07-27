// Next.js uses process.env with NEXT_PUBLIC_ prefix for client-accessible env vars
// Vite's import.meta.env.VITE_API_URL → NEXT_PUBLIC_API_URL
const isServer = typeof window === 'undefined';
const isLocalhost = !isServer && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === ''
);

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (isLocalhost
    ? 'http://localhost:5001/api'
    : 'https://aiva-aea6.onrender.com/api');
