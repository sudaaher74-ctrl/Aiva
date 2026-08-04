"use client";

import { useEffect } from 'react';

/**
 * One wheel gesture = one screen.
 *
 * Desktop only. Takes over the wheel from Lenis and moves the page in exact
 * viewport-sized steps that always land on a section boundary, so a section is
 * never left half visible. Sections taller than the viewport are stepped
 * through first, then the next section snaps into place.
 */
export default function useSectionSnap(selector = '.fullscreen-section') {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    if (!mq.matches) return;

    // Child effects run before the layout's, so Lenis may not exist yet.
    const getLenis = () => window.lenis;
    let animating = false;
    let releaseTimer = null;

    // Lenis keeps preventing the native wheel scroll while stopped, which is
    // exactly what we want: every step below goes through scrollTo instead.
    const stopTimer = setTimeout(() => getLenis()?.stop(), 0);

    const sections = () => Array.from(document.querySelectorAll(selector));

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const currentIndex = (list, y) => {
      for (let i = list.length - 1; i >= 0; i--) {
        if (y >= list[i].offsetTop - 2) return i;
      }
      return 0;
    };

    const scrollTo = (target) => {
      const clamped = Math.max(0, Math.min(target, maxScroll()));
      if (Math.abs(clamped - window.scrollY) < 2) return;

      animating = true;
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(() => {
        animating = false;
      }, 950);

      const lenis = getLenis();
      if (lenis) {
        lenis.stop();
        lenis.scrollTo(clamped, { duration: 0.9, force: true, lock: true });
      } else {
        window.scrollTo({ top: clamped, behavior: 'smooth' });
      }
    };

    const onWheel = (e) => {
      // Let scrollable widgets (product carousels, chatbot, modals) keep the wheel.
      if (e.target.closest?.('[data-native-scroll]')) return;

      e.preventDefault();
      if (animating) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 4) return;

      const list = sections();
      if (!list.length) return;

      const vh = window.innerHeight;
      const y = window.scrollY;
      const i = currentIndex(list, y);
      const section = list[i];
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (delta > 0) {
        // Still content below the fold inside this section: step down one screen,
        // stopping flush with the section's end.
        if (y + vh < bottom - 2) {
          scrollTo(Math.min(y + vh, bottom - vh));
        } else if (list[i + 1]) {
          scrollTo(list[i + 1].offsetTop);
        } else {
          scrollTo(maxScroll());
        }
      } else {
        if (y > top + 2) {
          scrollTo(Math.max(y - vh, top));
        } else if (list[i - 1]) {
          const prev = list[i - 1];
          // Land on the last screenful of a tall previous section, not its top.
          scrollTo(Math.max(prev.offsetTop, prev.offsetTop + prev.offsetHeight - vh));
        } else {
          scrollTo(0);
        }
      }
    };

    // Capture phase so this runs before Lenis' own wheel handling.
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      clearTimeout(releaseTimer);
      clearTimeout(stopTimer);
      getLenis()?.start();
    };
  }, [selector]);
}
