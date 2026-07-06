import React from 'react';
import { ViteReactSSG } from 'vite-react-ssg';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routes } from './App.jsx';

// Import all legacy CSS exactly as they were to maintain 100% visual fidelity
import './styles/lenis.css';
import './styles/styles.css';
import './styles/products.css';

import './index.css';

const queryClient = new QueryClient();

export const createRoot = ViteReactSSG(
  { routes },
  ({ app }) => {
    return (
      <React.StrictMode>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {app}
          </QueryClientProvider>
        </HelmetProvider>
      </React.StrictMode>
    );
  }
);
