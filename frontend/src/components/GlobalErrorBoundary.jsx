import React from 'react';
import { useRouteError } from 'react-router-dom';

export default function GlobalErrorBoundary() {
  const error = useRouteError();

  // If it's the JSON parsing error (likely due to stale cache and SPA fallback)
  // or a chunk loading error, we can auto-reload the page to fetch the latest assets.
  const isChunkError = 
    error?.message?.includes('is not valid JSON') || 
    error?.message?.includes('Unexpected token') ||
    error?.message?.includes('Failed to fetch dynamically imported module');

  if (isChunkError) {
    if (typeof window !== 'undefined') {
      // Prevent infinite reload loops by checking session storage
      if (!sessionStorage.getItem('reloaded_from_error')) {
        sessionStorage.setItem('reloaded_from_error', 'true');
        // Perform a cache-busting reload to bypass CDN/ServiceWorker caching of old index.html
        const search = window.location.search;
        const cacheBuster = search ? (search.includes('_t=') ? search : `${search}&_t=${Date.now()}`) : `?_t=${Date.now()}`;
        window.location.href = window.location.pathname + cacheBuster + window.location.hash;
        return null;
      }
    }
  }

  // Clear the flag if we render the error boundary and don't reload
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('reloaded_from_error');
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff', backgroundColor: '#000', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#d4b982', marginBottom: '1rem' }}>Something went wrong</h1>
      <p style={{ marginBottom: '2rem', color: '#ccc' }}>
        We experienced an issue loading this page. Please try refreshing.
      </p>
      <p style={{ color: 'red', marginBottom: '2rem', fontSize: '0.9rem', maxWidth: '600px', wordBreak: 'break-word' }}>
        {error?.message || error?.statusText || "Unknown error"}
      </p>
      <button 
        onClick={() => window.location.reload()} 
        style={{ padding: '10px 20px', backgroundColor: '#d4b982', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Refresh Page
      </button>
    </div>
  );
}
