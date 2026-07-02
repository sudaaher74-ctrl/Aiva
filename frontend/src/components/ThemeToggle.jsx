import React from 'react';
import { Moon, Leaf } from '@phosphor-icons/react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Compact segmented pill toggle: Midnight (moon) / Orchard (leaf).
 * `role="switch"` + aria-checked (checked === orchard). Keyboard operable.
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isOrchard = theme === 'orchard';

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOrchard}
      aria-label="Switch theme"
      title="Switch theme"
      className={`theme-toggle ${isOrchard ? 'is-orchard' : 'is-midnight'} ${className}`}
      onClick={toggleTheme}
      onKeyDown={onKeyDown}
    >
      <span className="theme-toggle-indicator" aria-hidden="true" />
      <span className="theme-toggle-seg" data-active={!isOrchard} aria-hidden="true">
        <Moon weight="fill" size={16} />
      </span>
      <span className="theme-toggle-seg" data-active={isOrchard} aria-hidden="true">
        <Leaf weight="fill" size={16} />
      </span>
    </button>
  );
}
