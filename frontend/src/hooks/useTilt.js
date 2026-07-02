import { useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Mouse-tracking 3D tilt for cards. Active ONLY in the Orchard theme,
 * on non-touch pointers, and when the user has not requested reduced motion.
 *
 * Returns { ref, handlers } — spread `handlers` onto the tilting element and
 * attach `ref` to it. The element should live inside a `perspective` wrapper
 * (see `.tilt-perspective` in theme-orchard.css) and may contain a
 * `[data-tilt-layer]` child that floats via translateZ.
 */
export default function useTilt(maxTilt = 8) {
  const { theme } = useTheme();
  const ref = useRef(null);

  const enabled = useMemo(() => {
    if (theme !== 'orchard') return false;
    if (typeof window === 'undefined') return false;
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !coarse && !reduced;
  }, [theme]);

  const onMouseMove = useCallback(
    (e) => {
      if (!enabled || !ref.current) return;
      const el = ref.current;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: px * maxTilt * 2,
        rotateX: -py * maxTilt * 2,
        translateZ: 10,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
      const layer = el.querySelector('[data-tilt-layer]');
      if (layer) {
        gsap.to(layer, { z: 30, duration: 0.4, ease: 'power2.out' });
      }
    },
    [enabled, maxTilt]
  );

  const reset = useCallback(() => {
    if (!ref.current) return;
    const el = ref.current;
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
    const layer = el.querySelector('[data-tilt-layer]');
    if (layer) gsap.to(layer, { z: 0, duration: 0.5, ease: 'power3.out' });
  }, []);

  const handlers = enabled ? { onMouseMove, onMouseLeave: reset } : {};

  return { ref, handlers, enabled };
}
