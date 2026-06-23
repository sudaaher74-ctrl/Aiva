import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';

gsap.registerPlugin(ScrollTrigger);

import MobileBottomNav from './components/MobileBottomNav';



function App() {
  const location = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // 1. Initialize Lenis (Smooth Scrolling)
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
  }, []);

  // Basic Analytics Tracking on route change
  useEffect(() => {
    try {
      const API_BASE =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === ''
          ? 'http://localhost:5000/api'
          : '/api';
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

  return (
    <>
      <Preloader />
      <Navbar />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        {/* If the user accesses products.html, we can catch it or rely on Vercel rewrites */}
        <Route path="/products.html" element={<Products />} />

      </Routes>
      
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default App;
