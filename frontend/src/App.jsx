import React, { useEffect, useState } from 'react';
import { useLocation, Outlet, useParams } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import ChatbotLogin from './pages/chatbot/ChatbotLogin';
import ChatbotApp from './pages/chatbot/ChatbotApp';
import PublicLayout from './components/PublicLayout';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import LaunchCountdown from './pages/LaunchCountdown';
import { API_BASE } from './config';

gsap.registerPlugin(ScrollTrigger);

export function AppRoot() {
  const location = useLocation();
  const [hasLaunched, setHasLaunched] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('aiva_launched_v2') === 'true' : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (location.pathname.startsWith('/chatbot')) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {

      fetch(`${API_BASE}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'page_view',
          pageUrl: location.pathname,
          countryCode: 'Unknown',
          browserInfo: navigator.userAgent,
        }),
      });
    } catch {
      // Silently ignore tracking errors
    }
  }, [location]);

  if (!hasLaunched) {
    return <LaunchCountdown onEnter={() => setHasLaunched(true)} />;
  }

  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
}

const ProductRouteHandler = () => {
  const { slug } = useParams();
  const categories = ['aseptic', 'concentrates', 'iqf'];
  if (categories.includes(slug)) {
    return <Products categorySlug={slug} />;
  }
  return <ProductDetail />;
};

export const routes = [
  {
    path: '/',
    element: <AppRoot />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/products', element: <Products /> },
          { path: '/products/:slug', element: <ProductRouteHandler /> },
          { path: '/about', element: <About /> },
          { path: '/contact', element: <Contact /> },
          { path: '/products.html', element: <Products /> },
        ]
      },
      { path: '/chatbot/login', element: <ChatbotLogin /> },
      { path: '/chatbot', element: <ChatbotApp /> },
    ]
  }
];
