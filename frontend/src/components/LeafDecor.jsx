import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Decorative floating leaf shapes for the Orchard theme only.
 * Absolutely positioned, pointer-events:none, very low opacity, gentle drift.
 * Renders nothing in Midnight so the current site is untouched.
 *
 * `variant` lets a section pick a layout: 'hero' | 'categories' | 'contact'.
 */
const Leaf = ({ className, style }) => (
  <svg
    className={`leaf-shape ${className || ''}`}
    style={style}
    viewBox="0 0 100 100"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M50 4C24 20 8 44 8 70c0 14 9 26 22 26 26 0 62-30 62-88C74 12 62 8 50 4Z"
      fill="var(--leaf-fill, rgba(30,86,49,0.06))"
    />
    <path
      d="M50 12C46 40 40 62 22 88"
      fill="none"
      stroke="var(--leaf-vein, rgba(30,86,49,0.08))"
      strokeWidth="2"
    />
  </svg>
);

export default function LeafDecor({ variant = 'default' }) {
  const { theme } = useTheme();
  if (theme !== 'orchard') return null;

  return (
    <div className={`leaf-decor leaf-decor--${variant}`} aria-hidden="true">
      <Leaf className="leaf-1" />
      <Leaf className="leaf-2" />
      <Leaf className="leaf-3" />
      <Leaf className="leaf-4" />
      <Leaf className="leaf-5" />
    </div>
  );
}
