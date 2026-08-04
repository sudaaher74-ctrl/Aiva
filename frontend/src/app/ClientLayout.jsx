"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { API_BASE } from '@/config';

gsap.registerPlugin(ScrollTrigger);

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Single driver for Lenis — the GSAP ticker. Driving it from a separate
    // requestAnimationFrame loop as well double-steps the easing each frame.
    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) return;
    try {
      fetch(API_BASE + '/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'page_view',
          pageUrl: pathname,
          countryCode: 'Unknown',
          browserInfo: navigator.userAgent,
        }),
      });
    } catch {
      // Silently ignore
    }
  }, [pathname]);

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
